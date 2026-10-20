import type { Metadata } from 'next';
import { RulesSection } from '@/components/home/NoirSections';

export const metadata: Metadata = {
  title: 'THE RULES | ALEXIS 雅思洋服',
  description: 'KNOW THE RULES. BREAK ONE. 西裝不是規矩，是起點。',
};

export default function RulesPage() {
  return <RulesSection />;
}
