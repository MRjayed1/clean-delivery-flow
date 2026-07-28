import { useState, useMemo, useEffect } from 'react';
import { format, isSameDay, isBefore, startOfDay, parseISO } from 'date-fns';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Package, Clock, LayoutList } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockCollections, ExtendedCollection } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function CollectionCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const today = startOfDay(new Date());

  // Periodically refresh to catch updates from mockCollections
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track both "Running" and "Overdue" properties
  const trackedCollections = useMemo(() => 
    mockCollections.filter(c => c.status === 'running' || c.status === 'overdue'), 
  [lastUpdate]);

  const runningMap = useMemo(() => {
    const map: Record<string, ExtendedCollection[]> = {};
    trackedCollections.filter(c => c.status === 'running').forEach(c => {
      const d = c.deadline;
      if (!map[d]) map[d] = [];
      map[d].push(c);
    });
    return map;
  }, [trackedCollections]);

  const overdueMap = useMemo(() => {
    const map: Record<string, ExtendedCollection[]> = {};
    trackedCollections.filter(c => c.status === 'overdue').forEach(c => {
      const d = c.deadline;
      if (!map[d]) map[d] = [];
      map[d].push(c);
    });
    return map;
  }, [trackedCollections]);

  // Check if today has any deadlines for the notification dot
  const hasTodayDeadline = useMemo(() => {
    const todayStr = format(today, 'yyyy-MM-dd');
    return !!runningMap[todayStr] || !!overdueMap[todayStr];
  }, [runningMap, overdueMap, today]);

  // Selected date collections
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const selectedCollections = [...(runningMap[selectedDateStr] || []), ...(overdueMap[selectedDateStr] || [])];

  // Custom day rendering for the calendar
  const modifiers = {
    running: (d: Date) => !!runningMap[format(d, 'yyyy-MM-dd')],
    overdue: (d: Date) => !!overdueMap[format(d, 'yyyy-MM-dd')],
  };

  const modifiersStyles = {
    running: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    overdue: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const scrollToProperty = (propertyId: string, status: string) => {
    // Switch to the correct tab first
    setSearchParams({ tab: status });

    // Wait for the DOM to update with the newly rendered tab content, then scroll
    setTimeout(() => {
      const element = document.getElementById(`collection-${propertyId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 150); // slight delay ensures the new tab content is mounted
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CalendarIcon className="h-5 w-5" />
          {hasTodayDeadline && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[350px] p-0 bg-popover z-50 shadow-xl border-border">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Collection Reminders
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Showing deadlines for active and overdue cycles
          </p>
        </div>

        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm bg-background"
            modifiers={modifiers}
            modifiersClassNames={{
              running: "bg-primary/10 text-primary font-bold hover:bg-primary/20",
              overdue: "bg-destructive/10 text-destructive font-bold hover:bg-destructive/20",
            }}
            components={{
              DayContent: ({ date: dayDate }) => {
                const dateStr = format(dayDate, 'yyyy-MM-dd');
                const runningCount = runningMap[dateStr]?.length || 0;
                const overdueCount = overdueMap[dateStr]?.length || 0;
                const totalCount = runningCount + overdueCount;
                const isOverdue = overdueCount > 0;
                
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{dayDate.getDate()}</span>
                    {totalCount > 0 && (
                      <span className={cn(
                        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                        isOverdue 
                          ? "bg-destructive text-destructive-foreground" 
                          : "bg-primary text-primary-foreground"
                      )}>
                        {totalCount}
                      </span>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>

        <Separator />

        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center justify-between">
            <span>{date ? format(date, 'MMMM d, yyyy') : 'Select a date'}</span>
            {selectedCollections.length > 0 && (
              <Badge variant="outline" className="text-[10px]">
                {selectedCollections.length} Due
              </Badge>
            )}
          </h4>

          <ScrollArea className="h-[200px] -mx-1 px-1">
            {selectedCollections.length > 0 ? (
              <div className="space-y-3">
                {selectedCollections.map((c) => (
                  <div 
                    key={c.id} 
                    className={cn(
                      "p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group",
                      c.status === 'overdue' ? "border-destructive/40 hover:border-destructive/60" : "border-primary/30 hover:border-primary/50"
                    )}
                    onClick={() => scrollToProperty(c.propertyId, c.status)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn(
                        "text-sm font-semibold transition-colors",
                        c.status === 'overdue' ? "group-hover:text-destructive text-destructive/90" : "group-hover:text-primary"
                      )}>
                        {c.propertyName}
                      </p>
                      <Badge variant={c.status === 'overdue' ? 'destructive' : 'default'} className="text-[9px] px-1 py-0 h-4">
                        {c.status === 'overdue' ? 'Overdue' : 'Running'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{c.propertyAddress}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          <Package className="w-3 h-3" />
                          <span>Delivered: {c.deliveryDate}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium",
                          c.status === 'overdue' ? "bg-destructive/10 text-destructive" : "bg-primary/5 text-primary"
                        )}>
                          <LayoutList className="w-3 h-3" />
                          <span>{c.items?.length || 0} Items</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-60">
                <CalendarIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">No collections due on this date.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
