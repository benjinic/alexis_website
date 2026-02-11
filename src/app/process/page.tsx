
import { PencilRuler, Scissors, PersonStanding } from 'lucide-react';

const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We begin with a conversation to understand your style, preferences, and the purpose of the garment. We explore fabrics, cuts, and details to create a unique vision.',
    icon: PencilRuler,
  },
  {
    step: '02',
    title: 'Measurement',
    description: 'Over 30 precise measurements are taken to ensure a perfect foundation for your garment. This data forms the blueprint for a pattern that is uniquely yours.',
    icon: PersonStanding,
  },
  {
    step: '03',
    title: 'Fitting',
    description: 'We conduct a series of fittings with a basted garment to sculpt it to your body. This iterative process is crucial for achieving an unparalleled fit and comfort.',
    icon: Scissors,
  },
];

export default function ProcessPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-7xl">The Process</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Our bespoke process is a symphony of precision, artistry, and collaboration, culminating in a garment that is an extension of you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-4">
        {processSteps.map((item, index) => (
          <div key={item.step} className="relative flex flex-col items-center text-center p-8">
            {index < processSteps.length - 1 && (
               <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-border -translate-y-1/2" />
            )}
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <item.icon className="h-12 w-12 text-accent" />
              </div>
              <p className="text-sm font-semibold text-accent mb-2">STEP {item.step}</p>
              <h3 className="font-headline text-3xl mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
