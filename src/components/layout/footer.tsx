
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const socialLinks = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ALEXIS ATELIER. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="ghost" size="sm" asChild>
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
