'use client';

import { useActionState } from 'react'; // Next.js 15 可能需要從 'react' 匯入，舊版用 'react-dom'
import { createBooking } from '@/app/actions/booking';
import { Button } from '@/components/ui/button'; // 假設您有這些元件
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const initialState = {
  message: '',
  success: false,
};

export default function BookingPage() {
  // 使用 Server Action
  const [state, formAction, isPending] = useActionState(createBooking, initialState);

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">ALEXIS BESPOKE</h1>
      <p className="text-center text-gray-500 mb-8">預約您的私人量身體驗</p>

      <form action={formAction} className="space-y-4">
        
        {/* 顯示成功或錯誤訊息 */}
        {state.message && (
          <div className={`p-4 rounded ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {state.message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <Input name="name" placeholder="您的稱呼" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">電子郵件</label>
          <Input name="email" type="email" placeholder="example@email.com" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">聯絡電話</label>
          <Input name="phone" type="tel" placeholder="0912-345-678" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">預約日期</label>
          <Input name="date" type="date" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">備註需求</label>
          <Textarea name="notes" placeholder="例如：婚禮需求、想要看特定布料..." />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-black text-white hover:bg-gray-800"
          disabled={isPending}
        >
          {isPending ? '提交中...' : '確認預約'}
        </Button>
      </form>
    </div>
  );
}