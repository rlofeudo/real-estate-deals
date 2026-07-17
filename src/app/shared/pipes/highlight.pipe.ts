import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, query: string | null | undefined): SafeHtml {
    const text = value ?? '';
    const term = query?.trim() ?? '';

    if (!term) {
      return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(text));
    }

    const escapedTerm = this.escapeRegExp(term);
    const pattern = new RegExp(`(${escapedTerm})`, 'gi');
    const highlighted = this.escapeHtml(text).replace(
      pattern,
      '<mark class="search-highlight">$1</mark>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
