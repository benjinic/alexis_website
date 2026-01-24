'use server';

import { getFirebaseDB } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

// 您的 WhatsApp 連結
const WHATSAPP_LINK = 'https://wa.me/85212345678'; 

export async function createBooking(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const date = formData.get('date') as string;
  const notes = formData.get('notes') as string;

  // 1. 【強制修正】直接將帳號密碼寫入，繞過環境變數讀取失敗的問題
  // 這些資訊來自您的截圖，直接寫在這裡保證讀得到
  const MY_GMAIL_USER = 'benjinic@alyceneverland.com';
  const MY_GMAIL_PASS = 'gnhlkvvjwsglnwcf'; 

  console.log('🔍 [Debug] 直接使用寫入的密碼進行連線...');

  // 2. 建立寄信通道
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MY_GMAIL_USER,
      pass: MY_GMAIL_PASS, 
    },
  });

  try {
    // 3. 寫入 Firebase 資料庫
    const db = getFirebaseDB();
    console.log('📝 寫入預約資料...');
    await db.collection('appointments').add({
      name,
      email,
      phone,
      date,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending',
      source: 'web_booking'
    });

    // 4. 寄送 Email
    console.log('📧 正在發送通知信...');
    
    // A. 寄給客戶
    const customerMail = transporter.sendMail({
      from: `"ALEXIS BESPOKE" <${MY_GMAIL_USER}>`,
      to: email,
      subject: '【ALEXIS】預約確認 - 您的私人量身服務',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">ALEXIS BESPOKE</h1>
          <p>親愛的 ${name} 您好，</p>
          <p>感謝您的預約。我們已收到您的量身需求。</p>
          <p><strong>預約日期：</strong> ${date}</p>
          <p>我們會盡快與您聯繫確認。</p>
          <br>
          <a href="${WHATSAPP_LINK}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            💬 WhatsApp 聯絡我們
          </a>
        </div>
      `,
    });

    // B. 寄給您自己
    const adminMail = transporter.sendMail({
      from: `"ALEXIS System" <${MY_GMAIL_USER}>`,
      to: MY_GMAIL_USER, 
      subject: `🔔 新預約：${name}`,
      text: `新預約資料：\n姓名: ${name}\n電話: ${phone}\n日期: ${date}\n備註: ${notes}`,
    });

    await Promise.all([customerMail, adminMail]);
    console.log('✅ Email 發送成功！');

    return { message: '預約成功！確認信已寄出。', success: true };

  } catch (error: any) {
    console.error('❌ 處理失敗:', error);
    return {
      message: `預約已記錄，但通知信發送失敗 (${error.message})`,
      success: true,
    };
  }
}