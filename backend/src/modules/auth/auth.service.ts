import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../users/user.model';
import { Company } from '../companies/company.model';
import { auditLog } from '../audit/audit.service';

function generateToken(
  id: string,
  email: string,
  companyId: string,
  role: 'ADMIN'
): string {
  return jwt.sign({ id, email, companyId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as any,
  });
}

// register() is intentionally removed — users are created by Super Admin only.

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).lean({ virtuals: false });

  // Re-fetch as mongoose document to use comparePassword method
  const userDoc = await User.findOne({ email });
  if (!userDoc) throw new Error('Invalid email or password');

  const isMatch = await userDoc.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  // Verify company is active
  const company = await Company.findById(userDoc.companyId).lean();
  if (!company) throw new Error('Company not found');
  if (company.status === 'SUSPENDED') {
    throw new Error('Your company account has been suspended. Please contact support.');
  }

  const token = generateToken(
    userDoc._id.toString(),
    userDoc.email,
    userDoc.companyId.toString(),
    userDoc.role
  );

  // Fire-and-forget audit
  auditLog({
    companyId: userDoc.companyId.toString(),
    action: 'USER_LOGIN',
    performedBy: userDoc._id.toString(),
  });

  return {
    token,
    user: {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      companyId: userDoc.companyId,
      companyName: company.name,
      companyLogo: company.logoUrl ?? null,
      plan: company.plan,
    },
  };
};
