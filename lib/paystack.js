export const initializePayment = async (email, amount, items) => {
  const response = await fetch('/api/paystack/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount, items }),
  });

  if (!response.ok) throw new Error('Failed to initialize payment');
  return response.json();
};

export const verifyPayment = async (reference) => {
  const response = await fetch(`/api/paystack/verify?reference=${reference}`);
  if (!response.ok) throw new Error('Failed to verify payment');
  return response.json();
};