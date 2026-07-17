import { SecurityContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightPipe],
    });
    pipe = TestBed.inject(HighlightPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  const toHtml = (value: ReturnType<HighlightPipe['transform']>) =>
    sanitizer.sanitize(SecurityContext.HTML, value);

  it('wraps case-insensitive matches in a mark tag', () => {
    const html = toHtml(pipe.transform('Very nice deal', 'nice'));

    expect(html).toContain('<mark class="search-highlight">nice</mark>');
    expect(html).toContain('Very ');
    expect(html).toContain(' deal');
  });

  it('returns escaped text when query is empty', () => {
    expect(toHtml(pipe.transform('A <deal>', ''))).toBe('A &lt;deal&gt;');
  });

  it('treats nullish value and query as empty strings', () => {
    expect(toHtml(pipe.transform(null, null))).toBe('');
    expect(toHtml(pipe.transform(undefined, undefined))).toBe('');
    expect(toHtml(pipe.transform('Plain', '   '))).toBe('Plain');
  });

  it('escapes HTML entities in the source text', () => {
    const html = toHtml(pipe.transform(`A & "b" 'c'`, 'b'));
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
    expect(html).toContain('&#39;');
    expect(html).toContain('<mark class="search-highlight">b</mark>');
  });

  it('escapes regex metacharacters in the query', () => {
    const html = toHtml(pipe.transform('price is $5.00 (exact)', '$5.00'));
    expect(html).toContain('<mark class="search-highlight">$5.00</mark>');
  });
});
