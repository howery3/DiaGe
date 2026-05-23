import { Router } from "express";

const router = Router();

router.get("/support", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Support — DiaGe</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0A0714;
      color: #e5e0f5;
      line-height: 1.7;
      min-height: 100vh;
    }
    .wrap {
      max-width: 740px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid #2a1f4a;
    }
    .logo-diamond {
      width: 36px;
      height: 36px;
      background: #5B21B6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .logo-name {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.5px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.8px;
      margin-bottom: 8px;
    }
    .meta {
      font-size: 13px;
      color: #7c6fa0;
      margin-bottom: 32px;
    }
    .info-box {
      background: rgba(91, 33, 182, 0.15);
      border: 1px solid rgba(91, 33, 182, 0.35);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 40px;
      font-size: 14px;
      color: #c4b5f5;
      line-height: 1.6;
    }
    section {
      margin-bottom: 36px;
    }
    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 12px;
      letter-spacing: -0.2px;
    }
    p {
      font-size: 15px;
      color: #c4b5f5;
      margin-bottom: 12px;
    }
    ul {
      list-style: none;
      padding: 0;
      margin-bottom: 12px;
    }
    ul li {
      font-size: 15px;
      color: #c4b5f5;
      padding: 5px 0 5px 20px;
      position: relative;
    }
    ul li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 13px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #5B21B6;
    }
    strong { color: #e5e0f5; font-weight: 600; }
    .contact-card {
      background: #16102a;
      border: 1px solid #2a1f4a;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 16px 0;
    }
    .contact-card a {
      color: #8B5CF6;
      text-decoration: none;
    }
    .contact-card a:hover { text-decoration: underline; }
    .contact-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #c4b5f5;
      margin-bottom: 8px;
    }
    .contact-row:last-child { margin-bottom: 0; }
    .contact-icon {
      width: 16px;
      text-align: center;
      color: #8B5CF6;
      flex-shrink: 0;
    }
    footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #2a1f4a;
      text-align: center;
      font-size: 13px;
      color: #7c6fa0;
      line-height: 1.6;
    }
    @media (max-width: 480px) {
      h1 { font-size: 26px; }
      .wrap { padding: 32px 20px 60px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo-diamond">💎</div>
      <span class="logo-name">DiaGe</span>
    </header>

    <h1>Support</h1>
    <p class="meta">We're here to help</p>

    <div class="info-box">
      Have a question, found a bug, or need help with your jewelry vault? Send us an email and we'll get back to you within 1–2 business days.
    </div>

    <section>
      <h2>Contact Us</h2>
      <p>For any support questions, reach out directly:</p>
      <div class="contact-card">
        <div class="contact-row">
          <span class="contact-icon">✉</span>
          <a href="mailto:support@diageapp.com">support@diageapp.com</a>
        </div>
      </div>
    </section>

    <section>
      <h2>Frequently Asked Questions</h2>

      <p><strong>How do I add a jewelry piece?</strong></p>
      <p>Tap the + button on the Collection tab, fill in the details, and add a photo. All fields except the name are optional.</p>

      <p><strong>Will my data be lost if I get a new phone?</strong></p>
      <p>No — your collection syncs securely to the cloud when you're signed in. Sign in on your new phone and everything will be restored automatically.</p>

      <p><strong>How do I set an inspection reminder?</strong></p>
      <p>Go to the Reminders tab, tap +, and choose a date and recurrence. DiaGe will send you a local notification when it's time.</p>

      <p><strong>How do I save a wishlist item?</strong></p>
      <p>Open the Wishlist tab and tap +. You can enter details manually or use the built-in browser to navigate to a retailer's product page and save from there.</p>

      <p><strong>How do I generate an insurance report?</strong></p>
      <p>Tap the total value banner on the home screen, or go to Profile → My Report. You can share the full report as text or screenshot it for your insurer.</p>

      <p><strong>How do I delete my account and data?</strong></p>
      <p>Go to Settings → scroll to the Data section → tap "Clear All Vault Data". This permanently erases all your pieces, wishlists, and reminders. To delete your account entirely, email us at <a href="mailto:support@diageapp.com" style="color:#8B5CF6;">support@diageapp.com</a>.</p>
    </section>

    <footer>
      DiaGe — Your jewelry, beautifully organized.
      <br /><br />
      © 2025 DiaGe. All rights reserved.
    </footer>
  </div>
</body>
</html>`);
});

export default router;
