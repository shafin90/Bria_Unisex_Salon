import Stripe from 'stripe';
import Tenant from '../tenant/tenant.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51P", {
    apiVersion: '2023-10-16' as any
});

export const handleStripeWebhook = async (req: any, res: any) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'account.updated') {
        const account: any = event.data.object;
        if (account.details_submitted) {
            const tenant: any = await Tenant.findOne({ where: { stripeAccountId: account.id } });
            if (tenant && tenant.stripeConnectStatus !== 'active') {
                await tenant.update({ stripeConnectStatus: 'active' });
                console.log(`Tenant ${tenant.id} connect status activated from webhook`);
            }
        }
    }

    // Return a 200 res to acknowledge receipt of the event
    res.json({received: true});
};
