// Development-only payment simulation.
// No real processing. Returns fake success responses.

export async function simulatePayment({ amount, currency = 'USD', method = 'stripe_test' }) {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 800));
  const id = 'pay_' + Math.random().toString(36).slice(2, 10);
  const providers = {
    stripe_test: 'Stripe (Test)',
    paypal_sandbox: 'PayPal (Sandbox)',
    razorpay_test: 'Razorpay (Test)',
  };
  return {
    id,
    provider: providers[method] || 'DevPay',
    status: 'succeeded',
    amount,
    currency,
    capturedAt: Date.now(),
  };
}
