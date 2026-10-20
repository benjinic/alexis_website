
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/shop';

// 未有網址嘅帳戶唔顯示，避免死連結
const socialLinks = SOCIAL_LINKS.filter((link) => link.href);

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-stone-300 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-sm text-stone-400">
          &copy; {new Date().getFullYear()} ALEXIS 雅思洋服. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 px-4 text-sm text-stone-200 hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
