const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.DASHBOARD_PASSWORD || 'RelevantPlay2026';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'rp-dashboard-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hour session
}));

// Login page HTML
const loginPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relevant Play — Sales Dashboard</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f0f0f;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255, 90, 31, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255, 160, 50, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 52px 48px;
      width: 100%;
      max-width: 420px;
      backdrop-filter: blur(20px);
      position: relative;
      z-index: 1;
    }

    .logo {
      font-family: 'DM Serif Display', serif;
      font-size: 26px;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }

    .logo span {
      color: #ff5a1f;
    }

    .subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.35);
      margin-bottom: 40px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    label {
      display: block;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.4);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    input[type="password"] {
      width: 100%;
      padding: 14px 18px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      margin-bottom: 16px;
    }

    input[type="password"]:focus {
      border-color: rgba(255, 90, 31, 0.6);
      background: rgba(255,255,255,0.08);
    }

    button {
      width: 100%;
      padding: 15px;
      background: #ff5a1f;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.3px;
      transition: background 0.2s, transform 0.1s;
    }

    button:hover { background: #e84e17; }
    button:active { transform: scale(0.99); }

    .error {
      background: rgba(255, 60, 60, 0.12);
      border: 1px solid rgba(255, 60, 60, 0.25);
      color: #ff8080;
      border-radius: 8px;
      padding: 11px 14px;
      font-size: 13px;
      margin-bottom: 16px;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 32px 0;
    }

    .footer {
      font-size: 12px;
      color: rgba(255,255,255,0.2);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Relevant<span>Play</span></div>
    <div class="subtitle">Sales Rep Dashboard</div>

    {{ERROR}}

    <form method="POST" action="/login">
      <label for="password">Access Password</label>
      <input type="password" id="password" name="password" placeholder="Enter password" autofocus autocomplete="current-password" />
      <button type="submit">Enter Dashboard</button>
    </form>

    <div class="divider"></div>
    <div class="footer">Authorized personnel only</div>
  </div>
</body>
</html>`;

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.redirect('/login');
}

// Routes
app.get('/', requireAuth, (req, res) => {
  const filePath = path.join(__dirname, 'dashboard_SRP.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading dashboard: ' + err.message);
    }
  });
});

app.get('/login', (req, res) => {
  res.send(loginPage.replace('{{ERROR}}', ''));
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    const error = '<div class="error">Incorrect password. Please try again.</div>';
    res.send(loginPage.replace('{{ERROR}}', error));
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
});
