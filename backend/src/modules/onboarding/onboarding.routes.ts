import { Router } from 'express';
import { signupTenant } from './onboarding.controller';

const router = Router();

router.post('/signup', signupTenant);

export default router;
