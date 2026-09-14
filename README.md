# MeuPet Web (Angular 19)

Mobile-first WebView UI based on the supplied Google Stitch UX.

## Local
```bash
npm install
npm start
```
API default: `http://localhost:3000/api`.

## Vercel
Import this folder as its own Vercel project. Framework preset: Angular. Build command: `npm run build`.
`vercel.json` includes SPA rewrite.

For production API URL, inject before Angular boot (e.g. small generated env script) as:
```js
window.__MEUPET_API_URL__='https://YOUR-API.vercel.app/api';
```

### Production API URL
Set `API_URL=https://YOUR-API.vercel.app/api` in the Vercel project. The `prebuild` script generates `public/env.js`, so the WebView points to the right backend without hardcoding a domain.
