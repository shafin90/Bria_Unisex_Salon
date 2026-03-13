import Stripe from 'stripe';
import env from '../../config/env';
import Tenant from '../tenant/tenant.model';

const stripe = new Stripe(env.stripeSecretKey as string, {
  apiVersion: '2025-01-27-acacia' as any,
});

export const subscriptionService = {
  createCustomer: async (tenantId: string, email: string) => {
    const customer = await stripe.customers.create({
      email,
      metadata: { tenantId }
    });
    await Tenant.update({ stripeCustomerId: customer.id }, { where: { id: tenantId } });
    return customer;
  },

  createSubscriptionSession: async (tenantId: string, priceId: string, successUrl: string, cancelUrl: string) => {
    const tenant = await Tenant.findByPk(tenantId) as any;
    
    if (!tenant.stripeCustomerId) {
      // Create customer on the fly if missing (e.g. legacy tenant)
      // This would normally be done during onboarding
    }

    const session = await stripe.checkout.sessions.create({
      customer: tenant.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { tenantId }
    });

    return session;
  },

  handleSubscriptionWebhook: async (event: Stripe.Event) => {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          await Tenant.update(
            { 
              subscriptionId: session.subscription as string,
              subscriptionStatus: 'active'
            },
            { where: { id: session.metadata?.tenantId } }
          );
        }
        break;
      
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await Tenant.update(
          { subscriptionStatus: 'canceled' },
          { where: { subscriptionId: subscription.id } }
        );
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as any;
        await Tenant.update(
          { subscriptionStatus: 'past_due' },
          { where: { subscriptionId: invoice.subscription as string } }
        );
        break;
    }
  }
};
