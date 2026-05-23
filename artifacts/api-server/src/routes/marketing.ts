import { Router } from "express";

const router = Router();

router.get("/marketing", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DiaGe — Your Personal Jewelry Vault</title>
  <meta name="description" content="Track your jewelry collection, manage your wishlist, and set inspection reminders — all in one elegant app." />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0A0714;
      color: #e5e0f5;
      line-height: 1.6;
      min-height: 100vh;
    }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      background: radial-gradient(ellipse at 50% 0%, rgba(91,33,182,0.45) 0%, transparent 70%);
      position: relative;
    }
    .wordmark {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 40px;
    }
    .diamond {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #7C3AED, #5B21B6);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 8px 32px rgba(91,33,182,0.5);
    }
    .brand {
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -1px;
    }
    .hero h1 {
      font-size: clamp(36px, 7vw, 64px);
      font-weight: 800;
      color: #fff;
      letter-spacing: -1.5px;
      line-height: 1.1;
      max-width: 700px;
      margin-bottom: 20px;
    }
    .hero h1 span {
      background: linear-gradient(135deg, #8B5CF6, #C4B5FD);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p {
      font-size: 18px;
      color: #a89cc8;
      max-width: 480px;
      margin-bottom: 40px;
      line-height: 1.7;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(91,33,182,0.2);
      border: 1px solid rgba(139,92,246,0.4);
      border-radius: 999px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      color: #C4B5FD;
    }
    .badge img { height: 20px; }

    /* FEATURES */
    .features {
      max-width: 960px;
      margin: 0 auto;
      padding: 80px 24px;
    }
    .section-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #8B5CF6;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(28px, 5vw, 42px);
      font-weight: 800;
      color: #fff;
      text-align: center;
      letter-spacing: -1px;
      margin-bottom: 16px;
    }
    .section-sub {
      font-size: 16px;
      color: #a89cc8;
      text-align: center;
      max-width: 480px;
      margin: 0 auto 56px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }
    .card {
      background: #16102a;
      border: 1px solid #2a1f4a;
      border-radius: 20px;
      padding: 28px;
    }
    .card-icon {
      width: 48px;
      height: 48px;
      background: rgba(91,33,182,0.25);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .card h3 {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }
    .card p {
      font-size: 14px;
      color: #a89cc8;
      line-height: 1.65;
    }

    /* CTA */
    .cta {
      text-align: center;
      padding: 80px 24px;
      background: radial-gradient(ellipse at 50% 100%, rgba(91,33,182,0.3) 0%, transparent 70%);
    }
    .cta h2 {
      font-size: clamp(28px, 5vw, 42px);
      font-weight: 800;
      color: #fff;
      letter-spacing: -1px;
      margin-bottom: 16px;
    }
    .cta p {
      font-size: 16px;
      color: #a89cc8;
      margin-bottom: 36px;
    }
    .app-store-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      color: #0A0714;
      border-radius: 16px;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .app-store-btn:hover { opacity: 0.9; }
    .app-store-btn span { font-size: 12px; font-weight: 400; display: block; }

    /* FOOTER */
    footer {
      border-top: 1px solid #2a1f4a;
      padding: 32px 24px;
      text-align: center;
      font-size: 13px;
      color: #7c6fa0;
    }
    footer a { color: #8B5CF6; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    .footer-links { display: flex; gap: 24px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }

    @media (max-width: 480px) {
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <section class="hero">
    <div class="wordmark">
      <div class="diamond">💎</div>
      <span class="brand">DiaGe</span>
    </div>
    <h1>Your jewelry,<br /><span>beautifully organized</span></h1>
    <p>Track your collection, manage your wishlist, and never miss an inspection — all in one elegant app built for jewelry lovers.</p>
    <div class="badge">
      📱 Available on the App Store
    </div>
  </section>

  <section class="features">
    <p class="section-label">Everything you need</p>
    <h2 class="section-title">Built for your collection</h2>
    <p class="section-sub">Every piece of jewelry tells a story. DiaGe helps you remember all of it.</p>

    <div class="grid">
      <div class="card">
        <div class="card-icon">💎</div>
        <h3>Jewelry Vault</h3>
        <p>Add photos and full details for every piece — material, gemstones, brand, serial number, warranties, and repair history.</p>
      </div>
      <div class="card">
        <div class="card-icon">🛡️</div>
        <h3>Insurance Ready</h3>
        <p>Generate a complete insurance summary with one tap. Share it directly with your insurer or save it for your records.</p>
      </div>
      <div class="card">
        <div class="card-icon">⭐</div>
        <h3>Wishlist</h3>
        <p>Save items from any retailer with price, ring size, and priority. Use the built-in browser to capture the exact piece you want.</p>
      </div>
      <div class="card">
        <div class="card-icon">🔔</div>
        <h3>Reminders</h3>
        <p>Schedule inspection and service reminders so your pieces stay in perfect condition. Never miss a warranty check again.</p>
      </div>
      <div class="card">
        <div class="card-icon">☁️</div>
        <h3>Syncs Everywhere</h3>
        <p>Your collection syncs securely across all your devices. Switch phones and everything is exactly where you left it.</p>
      </div>
      <div class="card">
        <div class="card-icon">📄</div>
        <h3>Document Storage</h3>
        <p>Attach receipts, certificates, and appraisal documents to each piece so everything is in one place when you need it.</p>
      </div>
    </div>
  </section>

  <section class="cta">
    <h2>Give your jewelry the home it deserves</h2>
    <p>Download DiaGe and start organizing your collection today.</p>
    <a class="app-store-btn" href="https://apps.apple.com" target="_blank">
      <span style="font-size:28px;line-height:1">🍎</span>
      <div>
        <span>Download on the</span>
        App Store
      </div>
    </a>
  </section>

  <footer>
    <div class="footer-links">
      <a href="/api/privacy">Privacy Policy</a>
      <a href="/api/support">Support</a>
    </div>
    © 2025 DiaGe. All rights reserved.
  </footer>

</body>
</html>`);
});

export default router;
