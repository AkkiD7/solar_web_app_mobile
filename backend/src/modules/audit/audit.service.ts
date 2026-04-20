import { AuditLog, AuditAction } from './audit-log.model';

interface AuditEntry {
  companyId: string;
  action: AuditAction;
  entityId?: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit logger.
 * Never throws — errors are silently swallowed so audit failures
 * never break the main request flow.
 */
export const auditLog = (entry: AuditEntry): void => {
  AuditLog.create(entry).catch((err) => {
    console.error('⚠️ Audit log failed (non-fatal):', (err as any)?.message);
  });
};
