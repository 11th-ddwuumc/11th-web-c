import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery = '', onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="border-2 border-black rounded-lg p-1.5 flex items-center justify-center">
            <img src="/icons/movie.svg" alt="" className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-gray-900">UMCine</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="cursor-pointer hover:text-black">영화</Link>
          <Link to="/search" className="cursor-pointer hover:text-black">검색</Link>
          <span className="cursor-pointer hover:text-black">내 정보</span>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src="/icons/search.svg"
            alt=""
            className="absolute inset-y-0 left-3 my-auto w-4 h-4 opacity-50"
          />
          <input
            type="text"
            defaultValue={searchQuery}
            onKeyDown={handleKeyDown}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 text-gray-900"
            placeholder="영화 검색..."
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
          로그인
        </button>
      </div>
    </header>
  );
};