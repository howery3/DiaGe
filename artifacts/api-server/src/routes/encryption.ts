import { Router } from "express";

const router = Router();

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

router.get("/encryption", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Encryption Exemption Notice — DiaGe</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #fff;
      color: #111;
      line-height: 1.7;
      padding: 60px 48px;
      max-width: 760px;
      margin: 0 auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #5B21B6;
      padding-bottom: 20px;
      margin-bottom: 36px;
    }
    .brand { display: flex; align-items: center; gap: 10px; }
    .diamond {
      width: 36px; height: 36px;
      background: #5B21B6;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .brand-name { font-size: 22px; font-weight: 800; color: #5B21B6; }
    .doc-label { font-size: 12px; color: #666; text-align: right; line-height: 1.4; }
    h1 { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 6px; }
    .sub { font-size: 14px; color: #555; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    td { padding: 10px 12px; font-size: 14px; vertical-align: top; border: 1px solid #e0d8f5; }
    td:first-child { font-weight: 600; color: #5B21B6; background: #f7f4ff; width: 200px; white-space: nowrap; }
    p { font-size: 14px; color: #333; margin-bottom: 16px; line-height: 1.75; }
    h2 { font-size: 15px; font-weight: 700; color: #5B21B6; margin: 28px 0 10px; }
    ul { padding-left: 20px; margin-bottom: 16px; }
    ul li { font-size: 14px; color: #333; margin-bottom: 6px; }
    .sig-block { margin-top: 48px; padding-top: 24px; border-top: 1px solid #ddd; font-size: 14px; color: #333; }
    .sig-line { margin-top: 32px; display: flex; gap: 48px; }
    .sig-field { flex: 1; }
    .sig-field .label { font-size: 11px; color: #888; margin-bottom: 28px; }
    .sig-field .underline { border-bottom: 1px solid #333; }
    footer { margin-top: 48px; font-size: 11px; color: #aaa; text-align: center; }
    @media print {
      body { padding: 40px 32px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="diamond">💎</div>
      <span class="brand-name">DiaGe</span>
    </div>
    <div class="doc-label">
      Encryption Exemption Notice<br />
      Date: ${today}
    </div>
  </header>

  <h1>Export Compliance — Encryption Exemption Notice</h1>
  <p class="sub">Submitted in connection with App Store review for DiaGe (iOS application)</p>

  <table>
    <tr><td>Application Name</td><td>DiaGe</td></tr>
    <tr><td>Bundle Identifier</td><td>com.diage.app</td></tr>
    <tr><td>Platform</td><td>iOS (Apple App Store)</td></tr>
    <tr><td>Version</td><td>1.0.0</td></tr>
    <tr><td>Developer</td><td>DiaGe</td></tr>
    <tr><td>Date</td><td>${today}</td></tr>
  </table>

  <h2>Encryption Use Declaration</h2>
  <p>
    DiaGe uses only standard, industry-standard encryption provided by Apple's iOS operating system
    and its built-in frameworks. No proprietary, custom, or non-standard encryption algorithms
    have been implemented within the application.
  </p>

  <h2>Encryption Technologies Used</h2>
  <ul>
    <li><strong>HTTPS / TLS</strong> — All network communication between the app and backend services uses HTTPS (TLS 1.2 or higher), provided by Apple's <code>URLSession</code> and the underlying iOS networking stack.</li>
    <li><strong>iOS Secure Storage</strong> — Authentication tokens are stored using Apple's Keychain Services (via Expo SecureStore), which uses AES-256 encryption managed entirely by iOS.</li>
    <li><strong>No custom encryption</strong> — The application does not implement any custom cryptographic algorithms, key exchange protocols, or encryption beyond what is provided by Apple's platform frameworks.</li>
  </ul>

  <h2>Exemption Basis</h2>
  <p>
    This application qualifies for the encryption exemption under the U.S. Export Administration
    Regulations (EAR), specifically:
  </p>
  <ul>
    <li>The encryption used is limited to authentication, digital signature, and standard data-in-transit protection (HTTPS/TLS).</li>
    <li>The cryptographic functionality is provided solely by Apple's iOS operating system and is not modified or extended by this application.</li>
    <li>This app is classified as "Exempt" per Apple's App Store export compliance guidelines for apps that use only standard encryption.</li>
  </ul>

  <div class="sig-block">
    <p>I hereby certify that the information provided in this Encryption Exemption Notice is accurate and complete.</p>
    <div class="sig-line">
      <div class="sig-field">
        <div class="underline">&nbsp;</div>
        <div class="label">Signature</div>
      </div>
      <div class="sig-field">
        <div class="underline">&nbsp;</div>
        <div class="label">Printed Name</div>
      </div>
      <div class="sig-field">
        <div class="underline">&nbsp;</div>
        <div class="label">Date</div>
      </div>
    </div>
  </div>

  <footer>DiaGe · com.diage.app · ${today}</footer>
</body>
</html>`);
});

export default router;
