import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true" || parseInt(process.env.SMTP_PORT || "465") === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendAccountCreationEmail({
  to,
  name,
  role,
  password,
}: {
  to: string;
  name: string;
  role: string;
  password: string;
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const loginUrl = `${baseUrl.replace(/\/$/, "")}/login`;
  const roleName = role === "ADMIN" ? "Quản trị viên" : "Thợ ảnh";

  const mailOptions = {
    from: `"Tiệm Ảnh Êm Roo" <${process.env.SMTP_USER || "no-reply@tiemanh.com"}>`,
    to,
    subject: "Thông tin tài khoản nhân sự mới - Tiệm Ảnh Êm Roo",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #10b981; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.025em;">Chào mừng bạn đến với Tiệm Ảnh!</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Tài khoản nhân sự mới đã được kích hoạt</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Xin chào <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Tài khoản nhân sự của bạn đã được khởi tạo thành công trên hệ thống. Dưới đây là thông tin đăng nhập chi tiết của bạn:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; width: 140px;">Email đăng nhập:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${to}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Mật khẩu tạm thời:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 16px; font-weight: bold; color: #ef4444;">${password}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Vai trò:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 500;">${roleName}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #ef4444; margin-bottom: 25px; font-weight: 500;">
          * Lưu ý: Để bảo mật, vui lòng đăng nhập và thay đổi mật khẩu của bạn ngay sau khi truy cập hệ thống.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; transition: background-color 0.2s;">
            Đăng nhập hệ thống
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; margin: 0;">
          Đây là email tự động từ hệ thống quản lý Tiệm Ảnh Êm Roo.<br/>
          Vui lòng không phản hồi trực tiếp email này.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
