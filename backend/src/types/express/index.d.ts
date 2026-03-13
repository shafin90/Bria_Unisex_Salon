import { UserPayload } from '../custom'; // or inline

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: any; // Replace with proper User interface later
    }
  }
}
