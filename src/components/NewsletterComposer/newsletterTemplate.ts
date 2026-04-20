const APP_URL = import.meta.env.VITE_APP_URL ?? '';

export function buildNewsletterTemplate(subject: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { margin: 0; padding: 0; background: #f3f4f6; font-family: Arial, sans-serif; }
        h1 { font-size: 24px; color: #2c2c2c; margin: 0 0 24px; }
        h2 { font-size: 20px; color: #2c2c2c; margin: 16px 0 8px; }
        p, div { font-size: 16px; line-height: 1.6; color: #2c2c2c; margin: 0 0 8px; }
        ol, ul { padding-left: 24px; margin: 8px 0; }
        li { font-size: 16px; line-height: 1.6; color: #2c2c2c; }
        a { color: #437EF7; }
        b, strong { font-weight: bold; }
        i, em { font-style: italic; }
        u { text-decoration: underline; }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:40px;">
              <tr>
                <td>
                  <h1>${subject}</h1>
                  ${body}
                </td>
              </tr>
              <tr>
                <td style="padding-top: 32px; border-top: 1px solid #e5e7eb; margin-top: 32px;">
                  <p style="font-size:12px; color:#8a92a6; text-align:center;">
                    You are receiving this email because you subscribed to our newsletter.<br/>
                    <a href="${APP_URL}/newsletter/unsubscribe">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
