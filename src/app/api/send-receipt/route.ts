import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// 初始化 Resend 引擎
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. 接收前端傳來的訂單資料
    let body: { email?: string; orderNumber?: string; name?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, code: 'INVALID_JSON', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { email, orderNumber, name } = body;

    // 2. Input validation — 確保必要欄位存在
    const missing: string[] = [];
    if (!email)       missing.push('email');
    if (!orderNumber) missing.push('orderNumber');
    if (!name)        missing.push('name');

    if (missing.length > 0) {
      console.warn(`[send-receipt] 400 MISSING_FIELDS: ${missing.join(', ')}`);
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_FIELDS',
          message: `Missing required fields: ${missing.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // TypeScript type narrowing after validation
    const validEmail = email as string;
    const validOrderNumber = orderNumber as string;
    const validName = name as string;

    // 4. 撰寫極簡高級的 HTML 郵件模板
    const htmlTemplate = `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1c1917; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">ALEXIS<span style="font-weight: 300;">BESPOKE</span></h1>
          <p style="font-size: 10px; color: #78716c; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 8px;">Official E-Invoice</p>
        </div>

        <div style="border-top: 1px solid #e7e5e4; border-bottom: 1px solid #e7e5e4; padding: 24px 0; margin-bottom: 40px;">
          <p style="font-size: 12px; line-height: 1.6;">Dear ${validName},</p>
          <p style="font-size: 12px; line-height: 1.6;">Thank you for your commission. Your bespoke order has been successfully placed and is now in our tailoring queue.</p>
        </div>

        <table style="width: 100%; font-size: 12px; margin-bottom: 40px;">
          <tr>
            <td style="padding-bottom: 12px; color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em;">Order Number</td>
            <td style="padding-bottom: 12px; text-align: right; font-weight: bold;">#${validOrderNumber}</td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px; color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em;">Status</td>
            <td style="padding-bottom: 12px; text-align: right; font-weight: bold;">PENDING (MEASUREMENTS CONFIRMED)</td>
          </tr>
        </table>

        <div style="text-align: center;">
          <p style="font-size: 10px; color: #a8a29e; letter-spacing: 0.1em; text-transform: uppercase;">You can view the full details in your Client Archive.</p>
          <p style="font-size: 10px; color: #a8a29e; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 24px;">© 2026 Alexis Tailor. All rights reserved.</p>
        </div>
      </div>
    `;

    // 5. 呼叫 API 寄出信件
    const data = await resend.emails.send({
      from: 'Alexis Bespoke <onboarding@resend.dev>', // 測試階段必須用這個預設信箱
      to: validEmail,
      subject: `Receipt for Order #${validOrderNumber} | ALEXIS BESPOKE`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[send-receipt] 500 INTERNAL_ERROR:', error);
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'Failed to send receipt email.' },
      { status: 500 }
    );
  }
}