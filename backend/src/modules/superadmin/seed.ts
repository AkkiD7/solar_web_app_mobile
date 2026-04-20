/**
 * Seed script — runs once on server start to create super admin if none exists.
 * Reads credentials from env vars: SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD
 */
import { PlatformAdmin } from './platform-admin.model';
import { env } from '../../config/env';

export const seedSuperAdmin = async (): Promise<void> => {
  try {
    const { superAdminEmail, superAdminPassword } = env;

    if (!superAdminEmail || !superAdminPassword) {
      console.log('⚠️  SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set — skipping seed');
      return;
    }

    const existing = await PlatformAdmin.findOne({ email: superAdminEmail });
    if (existing) {
      console.log('✅ Super admin already exists — seed skipped');
      return;
    }

    await PlatformAdmin.create({
      email: superAdminEmail,
      password: superAdminPassword, // hashed by pre-save hook
    });

    console.log(`✅ Super admin seeded: ${superAdminEmail}`);
  } catch (err) {
    console.error('❌ Super admin seed failed:', err);
  }
};
