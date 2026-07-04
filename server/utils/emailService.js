import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAcceptanceEmail = async (to, name, department) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">UNILAK</h1>
        <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 14px;">University of Lay Adventists of Kigali</p>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <h2 style="color: #059669; font-size: 18px; margin: 0 0 12px;">Application Accepted ✓</h2>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">Dear <strong>${name}</strong>,</p>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">Your request to join the <strong>${department}</strong> department has been reviewed and <strong style="color: #059669;">accepted</strong>.</p>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 20px;">Please visit the department office during working hours (Monday–Friday, 8:00 AM – 5:00 PM) to complete your enrollment.</p>
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;">
          <p style="color: #065f46; margin: 0; font-size: 13px;"><strong>📍 Location:</strong> UNILAK Main Campus, Department Office</p>
          <p style="color: #065f46; margin: 4px 0 0; font-size: 13px;"><strong>📄 Required:</strong> Bring your student ID and registration documents</p>
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">If you have any questions, reply to this email or contact the department directly.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} UNILAK — University of Lay Adventists of Kigali. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Application Accepted — ${department} Department — UNILAK`,
    html,
  });
};

export const sendRejectionEmail = async (to, name, department, reason) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">UNILAK</h1>
        <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 14px;">University of Lay Adventists of Kigali</p>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 12px;">Application Update</h2>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">Dear <strong>${name}</strong>,</p>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">Your request to join the <strong>${department}</strong> department has been reviewed and could not be approved at this time.</p>
        ${reason ? `<div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;"><p style="color: #991b1b; margin: 0; font-size: 13px;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
        <p style="color: #374151; line-height: 1.6; margin: 0 0 4px;">If you believe this is an error or would like further clarification, please visit the department office or contact us.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} UNILAK — University of Lay Adventists of Kigali. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Application Status — ${department} Department — UNILAK`,
    html,
  });
};

export const sendNewApplicationNotification = async (adminEmail, { fullName, registrationNumber, department }) => {
  if (!adminEmail) return;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">UNILAK</h1>
        <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 14px;">New Application Received</p>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <p style="color: #374151; line-height: 1.6; margin: 0 0 12px;">A new course request has been submitted:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${fullName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Reg No.</td><td style="padding: 8px 0; font-weight: 600;">${registrationNumber}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Department</td><td style="padding: 8px 0; font-weight: 600;">${department}</td></tr>
        </table>
        <p style="margin: 20px 0 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin" style="background: #1e3a5f; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; display: inline-block; font-size: 14px;">Review in Dashboard →</a>
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: `New Application: ${fullName} — ${department}`,
    html,
  });
};
