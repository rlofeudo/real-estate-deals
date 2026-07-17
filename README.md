# Real Estate Deals

Angular 17 example app for managing real estate deals with mock auth and an in-memory deal API.

## Stack

- Angular 17 (standalone components, signals)
- Signals store with **actions**, **reducers**, **selectors**, and **effects**
- Angular Router + Angular Material + SCSS + RxJS (effects)
- Jest

## Features

- Mock login: **admin** / **termsheet**
- Deal list with name + purchase-price filters (greater / less)
- Pagination of 10 deals per page
- Add / edit deals (data kept in memory only)
- 30 seeded mock deals

## Scripts

```bash
npm start              # Dev server at http://localhost:4200
npm run build          # Production build
npm run watch          # Rebuild on changes (development configuration)
npm test               # Run Jest once
npm run test:watch     # Jest in watch mode
npm run test:coverage  # Jest with coverage report
```
