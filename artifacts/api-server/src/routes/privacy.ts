import { Router } from "express";

const router = Router();

router.get("/privacy", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy — DiaGe</title>
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
    strong {
      color: #e5e0f5;
      font-weight: 600;
    }
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
    .contact-card a:hover {
      text-decoration: underline;
    }
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

    <h1>Privacy Policy</h1>
    <p class="meta">Last updated: May 2025</p>

    <div class="info-box">
      This Privacy Policy explains what information DiaGe collects, how it is used, and the choices you have. DiaGe is designed with privacy first — your jewelry data stays on your device.
    </div>

    <section>
      <h2>Who We Are</h2>
      <p>DiaGe ("we", "us", "our") is a personal jewelry organizer app that helps you store warranty documents, purchase records, wishlists, and inspection reminders. This Privacy Policy applies to all users of the DiaGe mobile application.</p>
      <p>For any privacy-related questions, you can reach us at: <strong>privacy@diageapp.com</strong></p>
    </section>

    <section>
      <h2>What Information We Collect</h2>
      <p>DiaGe collects only what you choose to provide:</p>
      <ul>
        <li>Profile information — your name, email address, and phone number (optional, stored only on your device)</li>
        <li>Jewelry vault data — piece descriptions, purchase prices, retailer names, warranty dates, and document photos you upload</li>
        <li>Wishlist items — jewelry items you save per retailer, including descriptions and price ranges</li>
        <li>Inspection reminders — dates and notes you set for jewelry maintenance</li>
        <li>Photos and documents — images you attach to vault entries (stored locally on your device)</li>
      </ul>
      <p>We do <strong>not</strong> collect: precise location, biometric data, payment card numbers, or any data without your explicit input.</p>
    </section>

    <section>
      <h2>Where Your Data Is Stored</h2>
      <div class="info-box">
        All personal jewelry data, profile information, and photos are stored exclusively on your device using local storage. DiaGe does not operate a cloud server that holds your personal records.
      </div>
      <p>Because data lives on your device, if you uninstall the app, lose your device, or clear app data, your vault contents cannot be recovered by us. We strongly recommend keeping original physical copies of all important documents.</p>
    </section>

    <section>
      <h2>How We Use Your Information</h2>
      <p>Information you enter into DiaGe is used solely to:</p>
      <ul>
        <li>Display your jewelry vault, wishlists, and reminders within the app</li>
        <li>Send inspection reminder notifications you have scheduled</li>
        <li>Pre-fill sharing summaries when you choose to share a piece or wishlist with a retailer</li>
        <li>Personalize your in-app experience (e.g. your name in greetings)</li>
      </ul>
    </section>

    <section>
      <h2>Analytics &amp; Partner Data Sharing</h2>
      <p>To support the app and our retail and insurance partner programs, we may collect and share <strong>anonymized, aggregated</strong> usage data with business partners. This may include:</p>
      <ul>
        <li>Jewelry category preferences (e.g. rings, necklaces) — no specific items</li>
        <li>Estimated price range brackets from your vault — not exact figures</li>
        <li>Retailer browsing patterns within the app</li>
        <li>Inspection reminder frequency</li>
        <li>Feature usage statistics</li>
      </ul>
      <p><strong>We do not sell your name, contact information, photos, or device identifiers to any third party.</strong> Shared analytics are aggregated across many users and cannot be used to identify you individually.</p>
      <p>If you share a wishlist or piece summary with a retailer through the app, the information in that share is sent directly to that retailer. You are always in control of when and what you share.</p>
    </section>

    <section>
      <h2>Your Rights &amp; Choices</h2>
      <p>Depending on where you live, you may have the following rights regarding your personal data:</p>
      <ul>
        <li>Right to access — request a summary of what data the app holds about you</li>
        <li>Right to deletion — delete all your data at any time from Settings → Clear All Vault Data</li>
        <li>Right to correction — update your profile information at any time in Settings → My Profile</li>
        <li>Right to opt out — contact us to opt out of anonymized analytics sharing</li>
        <li>Right to portability — your data is stored locally; you can export it by contacting us</li>
      </ul>
      <p><strong>California residents (CCPA):</strong> You have the right to know what personal information is collected, to delete it, and to opt out of its sale. We do not sell personal information.</p>
      <p><strong>EEA / UK residents (GDPR):</strong> Our legal basis for processing your data is your consent and our legitimate interest in providing the app. You have the right to lodge a complaint with your local data protection authority.</p>
    </section>

    <section>
      <h2>Deleting Your Data</h2>
      <p>You can permanently delete all vault data directly within the app:</p>
      <ul>
        <li>Go to Settings (gear icon in top right of the Retailers tab)</li>
        <li>Scroll to the Data section</li>
        <li>Tap "Clear All Vault Data" and confirm</li>
      </ul>
      <p>This will permanently erase all pieces, wishlists, reminders, and profile information from your device. This action cannot be undone.</p>
      <p>To request deletion of any analytics data we may hold, email us at <strong>privacy@diageapp.com</strong> and we will respond within 30 days.</p>
    </section>

    <section>
      <h2>Third-Party Services</h2>
      <p>DiaGe may display information from or link to third-party retailers and insurance providers. These third parties have their own privacy policies, and we are not responsible for their data practices.</p>
      <p>The app uses the following device services, subject to their respective privacy policies:</p>
      <ul>
        <li>Camera — used only to photograph jewelry and scan retailer QR codes</li>
        <li>Photo Library — used only to attach images you choose to vault entries</li>
        <li>Push Notifications — used only to deliver inspection reminders you set</li>
      </ul>
    </section>

    <section>
      <h2>Children's Privacy</h2>
      <p>DiaGe is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>
    </section>

    <section>
      <h2>Data Security</h2>
      <p>Since your data is stored locally on your device, its security depends on your device's security settings. We recommend enabling a passcode or biometric lock on your device. DiaGe does not transmit your personal jewelry records over the internet.</p>
    </section>

    <section>
      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any material changes through the app. Continued use of DiaGe after changes are posted constitutes your acceptance of the updated policy.</p>
    </section>

    <section>
      <h2>Contact Us</h2>
      <p>For any privacy questions, data requests, or concerns, contact us at:</p>
      <div class="contact-card">
        <div class="contact-row">
          <span class="contact-icon">✉</span>
          <a href="mailto:privacy@diageapp.com">privacy@diageapp.com</a>
        </div>
        <div class="contact-row">
          <span class="contact-icon">🌐</span>
          <span>www.diageapp.com/privacy</span>
        </div>
      </div>
      <p>We aim to respond to all privacy requests within 30 days.</p>
    </section>

    <footer>
      Your trust matters to us. DiaGe is built to keep your jewelry data private and secure — on your device, in your control.
      <br /><br />
      © 2025 DiaGe. All rights reserved.
    </footer>
  </div>
</body>
</html>`);
});

export default router;
