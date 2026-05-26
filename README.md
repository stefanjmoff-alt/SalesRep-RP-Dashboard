# SalesRep-RP-Dashboard

Relevant Play Sales Rep Dashboard — password protected, hosted on Railway.

## Updating the Dashboard

1. Get the new `dashboard_SRP.html` file from Claude
2. Replace `public/dashboard_SRP.html` with the new file
3. Commit and push to GitHub — Railway auto-deploys

```bash
git add public/dashboard_SRP.html
git commit -m "Update dashboard data"
git push
```

## Local Development

```bash
npm install
node server.js
```

Then open http://localhost:3000

## Railway Environment Variables

Set these in Railway → Variables:

| Variable | Value |
|---|---|
| `DASHBOARD_PASSWORD` | Your chosen password |
| `SESSION_SECRET` | Any long random string |
