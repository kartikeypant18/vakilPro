import type { User } from '@/types/user';
import { Card } from '@/components/ui/Card';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
        {user.name
          .split(' ')
          .map((part) => part[0])
          .join('')}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-accent">{user.name}</p>
        <p className="text-sm text-slate-500">{user.email}</p>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-accent/80">
          {user.role}
        </span>
      </div>
    </Card>
  );
}
