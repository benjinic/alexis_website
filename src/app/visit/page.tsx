import type { Metadata } from 'next';
import { VisitSection } from '@/components/home/NoirSections';

export const metadata: Metadata = {
  title: 'VISIT | ALEXIS 雅思洋服',
  description: '中環永吉街 18–24 號永富大廈 602 室。星期一至六 11:00–19:00，星期日及公眾假期預約；WhatsApp 預約量身。',
};

export default function VisitPage() {
  return <VisitSection />;
}
