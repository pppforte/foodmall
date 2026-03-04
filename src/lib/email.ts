import nodemailer from 'nodemailer';
import { getSettings } from '@/lib/settings';

interface InquiryEmailData {
  name: string;
  phone: string;
  hasStore: string;
  region: string;
  content: string;
  source: string;
}

export async function sendInquiryEmail(data: InquiryEmailData): Promise<boolean> {
  try {
    const settings = await getSettings();

    if (!settings.smtpUser || !settings.smtpPass) {
      console.warn('SMTP credentials not configured, skipping email');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost || 'smtp.gmail.com',
      port: settings.smtpPort || 587,
      secure: false,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    const sourceLabel = data.source === 'sky' ? '상단 바' : '본문 폼';

    await transporter.sendMail({
      from: settings.mailFrom || settings.smtpUser,
      to: settings.mailTo,
      subject: `[창업문의] ${data.name}님의 문의가 접수되었습니다`,
      html: `
        <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">창업 상담 문의</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; width: 120px; color: #555;">이름</td>
              <td style="padding: 12px;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; color: #555;">연락처</td>
              <td style="padding: 12px;">${data.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; color: #555;">점포 유무</td>
              <td style="padding: 12px;">${data.hasStore === 'yes' ? '있음' : '없음'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; color: #555;">희망 지역</td>
              <td style="padding: 12px;">${data.region}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; color: #555;">문의 내용</td>
              <td style="padding: 12px; white-space: pre-wrap;">${data.content}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #555;">접수 경로</td>
              <td style="padding: 12px;">${sourceLabel}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            접수일시: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}
