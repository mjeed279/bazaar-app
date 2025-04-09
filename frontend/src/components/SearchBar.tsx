import React from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="ابحث عن منتجات..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label="البحث"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
        aria-label="بحث"
      >
        <FaSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
