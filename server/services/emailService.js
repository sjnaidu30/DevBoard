import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass exists:", !!process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDigestEmail = async (
  managerEmail,
  teamName,
  standups,
  date,
) => {
  const standupRows = standups
    .map(
      (standup) => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <strong>${standup.name}</strong>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${standup.yesterday}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${standup.today}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${standup.blockers || "None"}
            </td>
        </tr>
    `,
    )
    .join("");

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">DevBoard Daily Digest</h2>
            <p style="color: #666;">Team: <strong>${teamName}</strong> | Date: <strong>${date}</strong></p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left;">Member</th>
                        <th style="padding: 12px; text-align: left;">Yesterday</th>
                        <th style="padding: 12px; text-align: left;">Today</th>
                        <th style="padding: 12px; text-align: left;">Blockers</th>
                    </tr>
                </thead>
                <tbody>
                    ${standupRows}
                </tbody>
            </table>

            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Sent by DevBoard — async standups for remote teams
            </p>
        </div>
    `;

  await transporter.sendMail({
    from: `DevBoard <${process.env.EMAIL_USER}>`,
    to: managerEmail,
    subject: `DevBoard Digest — ${teamName} — ${date}`,
    html,
  });
};
