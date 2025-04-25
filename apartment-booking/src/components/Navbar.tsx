import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-foreground text-background p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-accent transition-colors">
          Apartment Booking
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
