import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CartSidebar({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getTotal();

  const handleCheckout = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          amount: total,
          items: items,
        }),
      });

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError(data.error || 'Payment initialization failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-gray-900 shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded">
                <FiX size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="bg-gray-800 rounded p-3 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                        <p className="text-blue-400 font-bold">₦{item.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-900 rounded px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="flex-1 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-800 p-4 space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-400">₦{total.toLocaleString()}</span>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 rounded"
                >
                  {loading ? 'Processing...' : 'Pay with Paystack'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-red-400 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}