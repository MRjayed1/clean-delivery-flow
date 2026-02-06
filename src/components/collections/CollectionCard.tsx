import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Package, CalendarClock } from 'lucide-react';
import { ExtendedCollection } from '@/lib/mockData';
import { RescheduleModal } from './RescheduleModal';

interface CollectionCardProps {
  collection: ExtendedCollection;
  onUpdateCollection: (id: string, updates: Partial<ExtendedCollection>) => void;
}

export function CollectionCard({
  collection,
  onUpdateCollection,
}: CollectionCardProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const getStatusBadge = (status: ExtendedCollection['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="scheduled">Running</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
    }
  };

  const handleSaveReschedule = (updates: Partial<ExtendedCollection>) => {
    // When rescheduling, move from running to upcoming
    onUpdateCollection(collection.id, {
      ...updates,
      status: 'upcoming',
      manualOverride: true,
    });
  };

  return (
    <>
      <div className="dashboard-card p-5 hover:shadow-md transition-shadow">
        {/* Header with status badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(collection.status)}
            {collection.manualOverride && (
              <Badge variant="outline" className="border-primary bg-primary/10 text-primary">
                Manual Override
              </Badge>
            )}
          </div>
        </div>

        {/* Property info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">{collection.propertyName}</h3>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{collection.propertyAddress}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Delivery: {collection.deliveryDate}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Deadline: {collection.deadline}
            </p>
          </div>
        </div>

        {/* Reschedule button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRescheduleOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <CalendarClock className="w-4 h-4" />
            Reschedule
          </Button>
        </div>
      </div>

      <RescheduleModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        collection={collection}
        onSave={handleSaveReschedule}
      />
    </>
  );
}
