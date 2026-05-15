import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function Success() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { reference } = router.query;
    if (!reference) {
      router.push('/merch');
      return;
    }

    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setOrder(data);
        } else {
          router.push('/merch');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Verifying order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-gray-900 p-8 rounded-lg border border-gray-800">
        <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">Thank you for your order.</p>

        <div className="bg-gray-800 rounded p-4 mb-6 text-left space-y-3">
          <div>
            <p className="text-sm text-gray-400">Reference</p>
            <p className="font-mono text-blue-400 text-sm break-all">{order.reference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Amount</p>
            <p className="text-2xl font-bold">₦{(order.amount / 100).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{order.customer.email}</p>
          </div>
        </div>

        <Link
          href="/merch"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
}