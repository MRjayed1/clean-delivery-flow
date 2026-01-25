import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title: string;
  description?: string;
}

const notifications = [
  { id: 1, message: 'Overdue collection at Downtown Loft', type: 'overdue', unread: true },
  { id: 2, message: 'New early collection request', type: 'request', unread: true },
  { id: 3, message: 'Collection completed at Beachfront Villa', type: 'success', unread: false },
];

export function Header({ title, description }: HeaderProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center gap-4 lg:ml-0 ml-12">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover z-50">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.type === 'overdue'
                      ? 'bg-destructive'
                      : notification.type === 'request'
                      ? 'bg-warning'
                      : 'bg-success'
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      notification.unread ? 'font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
