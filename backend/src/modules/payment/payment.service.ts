import paymentRepository  from './payment.repository';
import Stripe from 'stripe';
import Booking  from '../booking/booking.model';
import Stylist  from '../stylist/stylist.model';
import Tenant from '../tenant/tenant.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51P", {
    apiVersion: '2023-10-16' as any
});

const paymentService = {
    createConnectAccount: async (tenantId: string, refreshUrl: string, returnUrl: string) => {
        const tenant: any = await Tenant.findByPk(tenantId);
        if (!tenant) throw new Error("Tenant not found");

        let accountId = tenant.stripeAccountId;
        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'standard', // Using standard connect
            });
            accountId = account.id;
            await tenant.update({ stripeAccountId: accountId });
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        return { url: accountLink.url };
    },
    verifyConnectStatus: async (tenantId: string) => {
        const tenant: any = await Tenant.findByPk(tenantId);
        if (!tenant || !tenant.stripeAccountId) throw new Error("Tenant or Stripe Account not found");

        const account = await stripe.accounts.retrieve(tenant.stripeAccountId);
        if (account.details_submitted) {
            await tenant.update({ stripeConnectStatus: 'active' });
            return { status: 'active', accountId: tenant.stripeAccountId };
        }
        return { status: 'pending' };
    },
    createPaymentIntent: async (amount: number, currency: string, bookingId: string, userId: string, tenantId: string) => {
        const tenant: any = await Tenant.findByPk(tenantId);
        if (!tenant || tenant.stripeConnectStatus !== 'active' || !tenant.stripeAccountId) {
            throw new Error("Salon payment processing is not fully set up.");
        }

        const totalAmountCents = Math.round(amount * 100);
        // Take a 5% platform fee for Bria Platform
        const platformFeeCents = Math.round(totalAmountCents * 0.05);

        return await stripe.paymentIntents.create({
            amount: totalAmountCents,
            currency: currency || "usd",
            application_fee_amount: platformFeeCents,
            transfer_data: {
                destination: tenant.stripeAccountId,
            },
            metadata: { bookingId, userId, tenantId }
        });
    },
    recordStripeSuccess: async (paymentData: any, tenantId: string) => {
        const { bookingId, userId, amount, paymentIntentId, paymentMethod } = paymentData;
        
        const booking = await Booking.findOne({ where: { id: bookingId, tenantId } });
        let commissionAmount = 0;
        let stylistId = null;

        if (booking && (booking as any).stylistId) {
            stylistId = (booking as any).stylistId;
            const stylist = await Stylist.findOne({ where: { id: stylistId, tenantId } });
            if (stylist) {
                commissionAmount = (amount * ((stylist as any).commissionRate || 10)) / 100;
            }
        }

        return await paymentRepository.create({
            bookingId,
            userId,
            amount,
            paymentMethod: paymentMethod || 'Card',
            transactionId: paymentIntentId,
            status: 'Completed',
            commissionAmount,
            stylistId
        }, tenantId);
    }
};

export default paymentService;
