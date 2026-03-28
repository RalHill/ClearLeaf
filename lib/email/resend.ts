import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "ClearLeaf <noreply@clearleaf.ca>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://clearleaf.ca";

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to ClearLeaf — Canada's HR Intelligence Layer",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0f1a0e;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1a0e;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#1a2b19;border-radius:12px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.1);">
              <span style="font-size:22px;color:#ffffff;font-weight:300;letter-spacing:-0.3px;">🌿 ClearLeaf</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 12px;font-size:26px;color:#ffffff;font-weight:300;">Welcome, ${name}.</h1>
              <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;">
                Your ClearLeaf account is ready. You're on the <strong style="color:#4ade80;">Free plan</strong> — 5 AI queries per month, province comparisons, and legislative news included.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;">
                Head to your dashboard to start asking employment law questions, compare province standards, and stay ahead of regulatory changes.
              </p>
              <a href="${APP_URL}/dashboard" style="display:inline-block;background:#22c55e;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">
                Go to dashboard →
              </a>
            </td>
          </tr>
          <!-- What's included -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;">Free plan includes</p>
                    <ul style="margin:0;padding:0;list-style:none;">
                      <li style="padding:4px 0;font-size:14px;color:rgba(255,255,255,0.7);">✓ &nbsp;5 AI employment law queries / month</li>
                      <li style="padding:4px 0;font-size:14px;color:rgba(255,255,255,0.7);">✓ &nbsp;Province-by-province law comparison</li>
                      <li style="padding:4px 0;font-size:14px;color:rgba(255,255,255,0.7);">✓ &nbsp;Legislative news feed</li>
                      <li style="padding:4px 0;font-size:14px;color:rgba(255,255,255,0.7);">✓ &nbsp;2 guided HR walkthroughs</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;">
                ClearLeaf provides informational intelligence only — not legal advice. Always consult a qualified Canadian employment lawyer for specific legal matters.<br /><br />
                © 2025 ClearLeaf · <a href="${APP_URL}" style="color:rgba(255,255,255,0.35);">clearleaf.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
