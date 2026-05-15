import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
      size: selectedSize || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500/50 transition"
    >
      {/* Image */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center text-6xl">
        {product.image}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white">{product.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{product.description}</p>
        </div>

        {product.sizes && (
          <div>
            <label className="text-xs text-gray-400 block mb-2">SIZE</label>
            <div className="flex gap-1 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-white">₦{product.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{product.stock} in stock</p>
        </div>

        <div className="flex gap-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
          >
            {[1, 2, 3, 4, 5].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <button
            onClick={handleAddToCart}
            className={`flex-1 font-semibold rounded transition ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}