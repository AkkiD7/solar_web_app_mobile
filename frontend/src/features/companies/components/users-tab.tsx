import { Edit3, KeyRound, Plus, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/features/shared/components/empty-state';
import { StatusBadge } from '@/features/shared/components/status-badge';
import { formatDate } from '@/features/shared/utils';
import type { CompanyUser } from '../types';
import { userId } from '../types';

export function UsersTab({
  users, onCreate, onEdit, onReset, onDeactivate,
}: {
  users: CompanyUser[];
  onCreate: () => void;
  onEdit: (user: CompanyUser) => void;
  onReset: (user: CompanyUser) => void;
  onDeactivate: (user: CompanyUser) => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b p-4">
        <div className="font-semibold">Company Users</div>
        <Button onClick={onCreate}><Plus className="size-4" /> Add User</Button>
      </div>
      {!users.length ? (
        <div className="p-4"><EmptyState title="No users found." icon={Users} /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={userId(user)}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                <TableCell><StatusBadge status={user.isActive === false ? 'INACTIVE' : 'ACTIVE'} /></TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user)}><Edit3 className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onReset(user)}><KeyRound className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeactivate(user)}><Trash2 className="size-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
