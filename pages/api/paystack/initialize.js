export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, amount, items } = req.body;

    if (!email || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid email or amount' });
    }

    const reference = `STUDIO-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        reference,
        metadata: { items },
      }),
    });

    const data = await response.json();

    if (data.status) {
      return res.status(200).json({
        status: true,
        authorization_url: data.data.authorization_url,
        reference,
      });
    }

    return res.status(400).json({ error: 'Payment initialization failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}