import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  change?: {
    value: string;
    trend: 'up' | 'down';
  };
}

export function StatCard({ title, value, icon: Icon, variant = 'default', change }: StatCardProps) {
  return (
    <div
      className={cn(
        'stat-card',
        variant === 'destructive' && 'stat-card-overdue',
        variant === 'success' && 'stat-card-success'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'mt-1 text-sm',
                change.trend === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {change.trend === 'up' ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl',
            variant === 'default' && 'bg-primary/10 text-primary',
            variant === 'success' && 'bg-success/10 text-success',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'destructive' && 'bg-destructive/10 text-destructive'
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
