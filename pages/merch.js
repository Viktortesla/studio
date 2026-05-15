import { useState } from 'react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { products } from '@/data/products';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';

export default function Merch() {
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const count = useCartStore((state) => state.getCount());

  const categories = ['all', 'apparel', 'accessories', 'drinkware'];
  const filtered = category === 'all' ? products : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 z-30 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            Studio Store
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-gray-900 rounded transition"
          >
            <FiShoppingCart size={24} />
            {count > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Studio Merch Store</h1>
          <p className="text-gray-400 text-lg">Premium merchandise for studio supporters</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap capitalize font-semibold transition ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}