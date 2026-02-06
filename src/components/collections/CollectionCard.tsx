import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle, MapPin, Calendar, Package, CalendarClock, Phone } from 'lucide-react';
import { ExtendedCollection } from '@/lib/mockData';
import { RescheduleModal } from './RescheduleModal';

interface CollectionCardProps {
  collection: ExtendedCollection;
  onMarkCollected: (id: string) => void;
  onMarkDelivered: (id: string) => void;
  onToggleManualOverride: (id: string, enabled: boolean) => void;
  onUpdateCollection: (id: string, updates: Partial<ExtendedCollection>) => void;
}

export function CollectionCard({
  collection,
  onMarkCollected,
  onMarkDelivered,
  onToggleManualOverride,
  onUpdateCollection,
}: CollectionCardProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const getStatusBadge = (status: ExtendedCollection['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="pending">Pending</Badge>;
      case 'collected':
        return <Badge variant="scheduled">Collected</Badge>;
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'overdue':
        return <Badge variant="overdue">Overdue</Badge>;
      case 'waiting-for-call':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          Waiting for Call
        </Badge>;
    }
  };

  const getPriorityBadge = (priority: ExtendedCollection['priority']) => {
    switch (priority) {
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
    }
  };

  const handleSaveReschedule = (updates: Partial<ExtendedCollection>) => {
    onUpdateCollection(collection.id, updates);
  };

  return (
    <>
      <div className="dashboard-card p-5 hover:shadow-md transition-shadow">
        {/* Header with status badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(collection.status)}
            {getPriorityBadge(collection.priority)}
            {collection.manualOverride && (
              <Badge variant="outline" className="border-primary bg-primary/10 text-primary">
                Manual Override
              </Badge>
            )}
          </div>
          <Badge variant={collection.collectionType === 'scheduled' ? 'scheduled' : 'warning'}>
            {collection.collectionType === 'scheduled' ? 'Scheduled' : 'Early Request'}
          </Badge>
        </div>

        {/* Property info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
            <p className="text-sm text-foreground">{collection.propertyAddress}</p>
          </div>
          
          {collection.deliveryDate && (
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Delivered: {collection.deliveryDate}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {collection.status === 'waiting-for-call' 
                ? 'Collection: Awaiting confirmation' 
                : `Deadline: ${collection.deadline}`}
            </p>
          </div>
        </div>

        {/* Manual Override Toggle */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id={`manual-${collection.id}`}
                checked={collection.manualOverride}
                onCheckedChange={(checked) => onToggleManualOverride(collection.id, checked)}
              />
              <Label htmlFor={`manual-${collection.id}`} className="text-sm cursor-pointer">
                Manual Scheduling
              </Label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRescheduleOpen(true)}
              className="flex items-center gap-1"
            >
              <CalendarClock className="w-4 h-4" />
              Reschedule
            </Button>
          </div>
        </div>

        {/* Action buttons based on status */}
        <div className="mt-4 space-y-2">
          {(collection.status === 'pending' || collection.status === 'overdue' || collection.status === 'waiting-for-call') && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={collection.status === 'overdue' ? 'destructive' : 'default'}
                onClick={() => onMarkCollected(collection.id)}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Collected
              </Button>
              <Button
                variant="outline"
                onClick={() => onMarkDelivered(collection.id)}
                className="w-full"
              >
                <Package className="w-4 h-4 mr-2" />
                Delivered
              </Button>
            </div>
          )}
          {collection.status === 'collected' && (
            <Button
              variant="default"
              onClick={() => onMarkDelivered(collection.id)}
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
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
