import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }),
  notes: z.string().trim().max(2000),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}

export type BookingResult = {
  success: boolean;
  message: string;
  status: 'disabled' | 'invalid' | 'not_saved' | 'saved_notification_failed' | 'saved_notified';
};

export type BookingDependencies = {
  save: (booking: BookingInput) => Promise<void>;
  notifyCustomer: (booking: BookingInput) => Promise<void>;
  notifyAdmin: (booking: BookingInput) => Promise<void>;
  logError: (stage: string, error: unknown) => void;
};

export async function processBooking(
  raw: unknown,
  deps: BookingDependencies,
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, status: 'invalid', message: '預約資料有誤，請檢查後再提交。' };
  }
  const booking = parsed.data;
  try {
    await deps.save(booking);
  } catch (error) {
    deps.logError('booking_save_failed', error);
    return { success: false, status: 'not_saved', message: '未能提交預約，請改用 WhatsApp 聯絡我們。' };
  }

  const results = await Promise.allSettled([
    deps.notifyCustomer(booking),
    deps.notifyAdmin(booking),
  ]);
  const failed = results.some((result) => result.status === 'rejected');
  results.forEach((result, index) => {
    if (result.status === 'rejected') deps.logError(
      index === 0 ? 'customer_notification_failed' : 'admin_notification_failed',
      result.reason,
    );
  });
  return failed
    ? { success: true, status: 'saved_notification_failed', message: '已收到預約申請，通知可能延遲。我們會再與您確認。' }
    : { success: true, status: 'saved_notified', message: '已收到預約申請，我們會再與您確認。' };
}
