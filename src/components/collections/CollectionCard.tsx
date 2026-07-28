import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Package, CheckCircle, Info, LayoutList, Clock } from 'lucide-react';
import { ExtendedCollection } from '@/lib/mockData';
import { CollectionDetailsModal } from './CollectionDetailsModal';

interface CollectionCardProps {
  collection: ExtendedCollection;
  onUpdateCollection: (id: string, updates: Partial<ExtendedCollection>) => void;
}

export function CollectionCard({
  collection,
  onUpdateCollection,
}: CollectionCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

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

  const handleMarkDelivered = () => {
    onUpdateCollection(collection.id, {
      status: 'running',
      deliveryDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleShowDetails = (index: number | null = null) => {
    setSelectedItemIndex(index);
    setDetailsOpen(true);
  };

  return (
    <>
      <div id={`collection-${collection.propertyId}`} className="dashboard-card p-5 hover:shadow-md transition-shadow flex flex-col h-full">
        {/* Header with status badge */}
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(collection.status)}
            {collection.manualOverride && (
              <Badge variant="outline" className="border-primary bg-primary/10 text-primary">
                Manual Override
              </Badge>
            )}
          </div>
          {collection.items && collection.items.length > 1 && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {collection.items.length} Items
            </Badge>
          )}
        </div>

        {/* Property info */}
        <div className="space-y-3 flex-1">
          <h3 className="font-semibold text-lg text-foreground truncate">{collection.propertyName}</h3>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2">{collection.propertyAddress}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              Delivery: {collection.deliveryDate}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              Deadline: {collection.deadline}
            </p>
          </div>

          {/* Item List Summary */}
          {collection.items && collection.items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <LayoutList className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Laundry Cycle Items</span>
              </div>
              <ul className="space-y-3">
                {collection.items.map((item, index) => {
                  const totalQty = Object.values(item.quantities).reduce((a, b) => a + b, 0);
                  return (
                    <li key={item.id} className="bg-muted/40 rounded-lg border border-border/30 p-3 space-y-2 group/item">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold text-foreground">Item {index + 1}</span>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-7 px-3 text-[10px] font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                          onClick={() => handleShowDetails(index)}
                        >
                          <Info className="w-3 h-3 mr-1.5" />
                          See Details
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 pl-7">
                        <div className="flex items-center gap-1.5 bg-background px-2 py-0.5 rounded border border-border/50">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-medium text-muted-foreground">{totalQty} Units</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic truncate flex-1">
                          {item.description || 'No description provided'}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Actions section */}
        <div className="mt-6 pt-4 border-t border-border shrink-0">
          <div className="grid grid-cols-1 gap-3">
            {collection.status === 'running' ? (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="w-full flex items-center justify-center gap-2 bg-muted/50 text-muted-foreground font-medium"
              >
                <Clock className="w-4 h-4" />
                Active Running Cycle
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowDetails(null)}
                  className="flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  See Details
                </Button>
                
                {collection.status === 'upcoming' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMarkDelivered}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Delivered
                  </Button>
                )}
                
                {collection.status === 'overdue' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      onUpdateCollection(collection.id, { status: 'completed' });
                      const currentCount = parseInt(localStorage.getItem('collectionsReceived') || '0', 10);
                      localStorage.setItem('collectionsReceived', (currentCount + 1).toString());
                    }}
                    className="flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Received
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CollectionDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        collection={collection}
        itemIndex={selectedItemIndex}
      />
    </>
  );
}
