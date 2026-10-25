'use server';

import { db } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';
import { WHATSAPP_URL } from '@/lib/shop';
import { escapeHtml, processBooking, type BookingResult } from '@/lib/booking-security';

export async function createBooking(
  _prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<BookingResult> {
  // D08: disabled by default. Never enable in production without separate approval.
  if (process.env.BOOKING_ACTION_ENABLED !== 'true') {
    return { success: false, status: 'disabled', message: '網上預約暫未開放，請使用 WhatsApp 聯絡我們。' };
  }

  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!user || !password) {
    console.error('[booking] mail configuration unavailable');
    return { success: false, status: 'disabled', message: '網上預約暫未開放，請使用 WhatsApp 聯絡我們。' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password },
  });

  return processBooking({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    date: formData.get('date'),
    notes: formData.get('notes') ?? '',
  }, {
    save: async (booking) => {
      await db.collection('appointments').add({
        ...booking,
        createdAt: new Date().toISOString(),
        status: 'pending',
        source: 'web_booking',
      });
    },
    notifyCustomer: async (booking) => {
      await transporter.sendMail({
        from: { name: 'ALEXIS BESPOKE', address: user },
        to: booking.email,
        subject: '【ALEXIS】已收到您的預約申請',
        html: `<div style="font-family:sans-serif">
          <h1>ALEXIS BESPOKE</h1>
          <p>親愛的 ${escapeHtml(booking.name)} 您好，</p>
          <p>我們已收到您的預約申請，尚待人工確認。</p>
          <p>預約日期：${escapeHtml(booking.date)}</p>
          <a href="${escapeHtml(WHATSAPP_URL)}">WhatsApp 聯絡我們</a>
        </div>`,
      });
    },
    notifyAdmin: async (booking) => {
      await transporter.sendMail({
        from: { name: 'ALEXIS System', address: user },
        to: user,
        subject: '新預約申請',
        text: `姓名: ${booking.name}\n電郵: ${booking.email}\n電話: ${booking.phone}\n日期: ${booking.date}\n備註: ${booking.notes}`,
      });
    },
    logError: (stage) => {
      // Never log raw provider errors, which may contain secrets or personal data.
      console.error('[booking]', stage);
    },
  });
}
