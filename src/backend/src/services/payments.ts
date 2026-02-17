import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-02-01',
});

export class PaymentService {
  constructor(private db: NodePgDatabase) {}

  // Create Stripe Connect account for seller
  async createConnectAccount(userId: string, email: string): Promise<string> {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        userId,
      },
    });

    return account.id;
  }

  // Create onboarding link
  async createAccountLink(accountId: string): Promise<string> {
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.APP_URL}/seller/onboarding/refresh`,
      return_url: `${process.env.APP_URL}/seller/onboarding/complete`,
      type: 'account_onboarding',
    });

    return link.url;
  }

  // Create payment intent for buyer
  async createPaymentIntent(
    amountCents: number,
    buyerId: string,
    sellerStripeAccountId: string
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      on_behalf_of: sellerStripeAccountId,
      metadata: {
        buyerId,
        type: 'escrow',
      },
    });

    return paymentIntent;
  }

  // Capture payment (release to seller)
  async capturePayment(paymentIntentId: string): Promise<void> {
    await stripe.paymentIntents.capture(paymentIntentId);
  }

  // Cancel/refund payment
  async cancelPayment(paymentIntentId: string): Promise<void> {
    await stripe.paymentIntents.cancel(paymentIntentId);
  }

  // Handle webhook events
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update transaction status
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      case 'account.updated':
        // Update seller account status
        break;
    }
  }
}
