"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleItemClick = (href: string) => {
    closeDropdown();
    // Handle other actions if needed
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredRoutes = data
    .filter((route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((route) => ({
      href: `/category/${route.id}`,
      label: route.name,
      active: pathname === `/category/${route.id}`,
    }));

  return (
    <nav className="mx-6 relative">
      <button
        className="text-sm font-medium transition-colors hover:text-black focus:outline-none  p-2 rounded-full border-2"
        onClick={toggleDropdown}
      >
        Categories
      </button>
      {isDropdownOpen && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-white border rounded shadow-md z-10 p-4"
        >
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          {filteredRoutes.map((route) => (
            <li key={route.href} onClick={() => handleItemClick(route.href)}>
              <Link href={route.href} passHref>
                <div
                  className={cn(
                    'block px-4 py-2 transition-colors hover:bg-gray-200 cursor-pointer',
                    route.active ? 'text-black' : 'text-neutral-500'
                  )}
                >
                  {route.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default MainNav;

