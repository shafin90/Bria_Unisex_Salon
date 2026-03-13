import Admin from './src/modules/auth/auth.model';
import bcrypt from 'bcryptjs';
import { connectDB } from './src/config/db';

async function seedSuperAdmin() {
    console.log("Seeding Super Admin...");
    await connectDB();
    
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    // Super Admin doesn't need a tenantId (null)
    const [admin, created] = await Admin.findOrCreate({
        where: { email: 'super@bria.com' },
        defaults: {
            password: hashedPassword,
            role: 'Super Admin',
            tenantId: null 
        }
    });

    if (created) {
        console.log("✅ Super Admin created: super@bria.com / superadmin123");
    } else {
        console.log("ℹ️ Super Admin already exists.");
    }
    
    process.exit(0);
}

seedSuperAdmin();
