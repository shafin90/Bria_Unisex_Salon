import Stripe from 'stripe';
import Tenant from '../tenant/tenant.model';
import env from '../../config/env';
import { subscriptionService } from '../billing/subscription.service';

const stripe = new Stripe(env.stripeSecretKey as string, {
  apiVersion: '2025-01-27-acacia' as any,
});

export const handleStripeWebhook = async (req: any, res: any) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = env.stripeWebhookSecret;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook Warning (Signature Failed):', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Processing Stripe Webhook: ${event.type}`);

    try {
        // Handle BOTH Connect and Billing events
        if (event.type === 'account.updated') {
            const account: any = event.data.object;
            if (account.details_submitted) {
                const tenant: any = await Tenant.findOne({ where: { stripeAccountId: account.id } });
                if (tenant && tenant.stripeConnectStatus !== 'active') {
                    await tenant.update({ stripeConnectStatus: 'active' });
                    console.log(`Tenant ${tenant.id} connect status activated`);
                }
            }
        } else {
            // Forward to subscription service for billing events
            await subscriptionService.handleSubscriptionWebhook(event);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook Processing Error:', error.message);
        res.status(500).json({ error: "Webhook processing failed." });
    }
};
