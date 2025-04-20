'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-purple-600">Todosssss</Link>
        
        <div className="flex space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}