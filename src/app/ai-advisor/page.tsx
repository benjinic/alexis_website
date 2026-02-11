import AiAdvisorClient from './ai-advisor-client';

export const metadata = {
  title: 'AI Stylist | Alexis Bespoke',
  description: 'Get bespoke styling advice tailored to your mission.',
};

export default function AiAdvisorPage() {
  return (
    <div className="container mx-auto py-10">
      <AiAdvisorClient />
    </div>
  );
}