import { Link } from "react-router-dom";
import { HiOutlineStar } from "react-icons/hi";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3.5">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <HiOutlineStar className="h-8 w-8 text-white" />
              <span className="text-xl font-semibold text-white">
                Hobbies App
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-7xl bg-gray-100 p-6">{children}</div>
      </main>
    </div>
  );
};
