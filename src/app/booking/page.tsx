export const runtime = 'nodejs';
import BookingForm from './booking-form';

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:py-32">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="lg:pr-8">
          <h1 className="font-headline text-5xl md:text-7xl mb-6">Book an Appointment</h1>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              Reserve your private consultation at the ALEXIS atelier. We invite you to experience our world of bespoke tailoring and begin the journey of creating your unique garment.
            </p>
            <div className="space-y-2 border-l-2 border-accent pl-4">
              <p><strong className="text-foreground">Address:</strong> Room 602, 6/F Wing Fu Building,Wing Kut Street, Central</p>
              <p><strong className="text-foreground">Hours:</strong> Tues-Sat, 10am - 6pm (By Appointment)</p>
              <p><strong className="text-foreground">Map:</strong> <a href="#" className="underline hover:text-accent">View on Google Maps</a> (Future expansion)</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-xl">
            <BookingForm />
        </div>
      </div>
    </div>
  );
}
