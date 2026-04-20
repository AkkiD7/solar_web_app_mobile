import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'USER_LOGIN'
  | 'LEAD_CREATED'
  | 'LEAD_UPDATED'
  | 'LEAD_DELETED'
  | 'QUOTE_GENERATED'
  | 'SETTINGS_UPDATED'
  | 'LOGO_UPLOADED'
  | 'PLAN_CHANGED'
  | 'COMPANY_SUSPENDED'
  | 'COMPANY_ACTIVATED';

export interface IAuditLog extends Document {
  companyId: mongoose.Types.ObjectId;
  action: AuditAction;
  entityId?: string;
  performedBy: string; // userId or 'SUPER_ADMIN'
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN', 'LEAD_CREATED', 'LEAD_UPDATED', 'LEAD_DELETED',
        'QUOTE_GENERATED', 'SETTINGS_UPDATED', 'LOGO_UPLOADED',
        'PLAN_CHANGED', 'COMPANY_SUSPENDED', 'COMPANY_ACTIVATED',
      ] as AuditAction[],
    },
    entityId: { type: String },
    performedBy: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // immutable — no updates
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
