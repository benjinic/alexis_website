import { test, expect } from '@playwright/test';
import { escapeHtml, processBooking, type BookingDependencies } from '../../src/lib/booking-security';
const input = { name: 'Test Customer', email: 'test@example.com', phone: '12345678', date: '2026-11-05', notes: '' };
function deps(overrides: Partial<BookingDependencies> = {}): BookingDependencies {
  return { save: async () => {}, notifyCustomer: async () => {}, notifyAdmin: async () => {}, logError: () => {}, ...overrides };
}
test('valid booking', async () => {
  const r = await processBooking(input, deps());
  expect(r.status).toBe('saved_notified');
});
test('invalid input never writes', async () => {
  let writes = 0;
  const r = await processBooking({ ...input, email: 'invalid' }, deps({ save: async () => { writes++; } }));
  expect(r.status).toBe('invalid');
  expect(writes).toBe(0);
});
test('failed storage never claims success or sends mail', async () => {
  let sends = 0;
  const r = await processBooking(input, deps({ save: async () => { throw new Error('PRIVATE_DB'); }, notifyCustomer: async () => { sends++; } }));
  expect(r.status).toBe('not_saved');
  expect(r.success).toBe(false);
  expect(r.message).not.toContain('PRIVATE_DB');
  expect(sends).toBe(0);
});
test('failed customer email keeps saved state without exposing error', async () => {
  const r = await processBooking(input, deps({ notifyCustomer: async () => { throw new Error('PRIVATE_SMTP'); } }));
  expect(r.status).toBe('saved_notification_failed');
  expect(r.message).not.toContain('PRIVATE_SMTP');
});
test('failed admin email is recorded separately', async () => {
  const r = await processBooking(input, deps({ notifyAdmin: async () => { throw new Error('PRIVATE_SMTP'); } }));
  expect(r.status).toBe('saved_notification_failed');
});
test('HTML content escaped', () => {
  expect(escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});
test('invalid dates and oversized notes rejected', async () => {
  for (const bad of [{ ...input, date: '2026-02-30' }, { ...input, notes: 'x'.repeat(2001) }]) {
    expect((await processBooking(bad, deps())).status).toBe('invalid');
  }
});
