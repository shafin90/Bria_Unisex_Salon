import { Request, Response } from 'express';
import Tenant from '../tenant/tenant.model';
import Admin from '../auth/auth.model';
import { subscriptionService } from '../billing/subscription.service';
import bcrypt from 'bcryptjs';

export const signupTenant = async (req: Request, res: Response) => {
    const { name, subdomain, email, password } = req.body;

    try {
        // 1. Check if subdomain exists
        const existingTenant = await Tenant.findOne({ where: { subdomain } });
        if (existingTenant) {
            return res.status(400).json({ error: "Subdomain already taken." });
        }

        // 2. Create Tenant
        const tenant: any = await Tenant.create({
            name,
            subdomain,
            planTier: 'basic' // Default plan
        });

        // 3. Create Owner Admin
        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({
            email,
            password: hashedPassword,
            role: 'Owner',
            tenantId: tenant.id
        });

        // 4. Register with Stripe for Billing
        await subscriptionService.createCustomer(tenant.id, email);

        res.status(201).json({
            success: true,
            message: "Tenant created successfully. Please login to choose your plan.",
            tenantId: tenant.id
        });
    } catch (error: any) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ error: "Onboarding failed. Please try again later." });
    }
};
