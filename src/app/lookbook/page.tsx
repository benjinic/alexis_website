import type { Metadata } from 'next';
import { LookbookSection } from '@/components/home/NoirSections';

export const metadata: Metadata = {
  title: 'LOOKBOOK | ALEXIS 雅思洋服',
  description: 'SEVEN WAYS TO WEAR IT. 同一套西裝，不止一種男人。',
};

export default function LookbookPage() {
  return <LookbookSection />;
}
