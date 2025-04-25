import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background p-4 mt-8">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">Apartment Booking</p>
        </div>
        <div>
          <p className="text-right">Abdelrhman Ammar</p>
        </div>
      </div>
    </footer>
  );
}