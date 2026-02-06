import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, PlayCircle, Calendar, CheckCircle, Phone } from 'lucide-react';
import { mockCollections, ExtendedCollection } from '@/lib/mockData';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { addDays, format } from 'date-fns';

export default function Collections() {
  const [collections, setCollections] = useState<ExtendedCollection[]>(mockCollections);

  const handleMarkCollected = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'collected' as const } : c))
    );
  };

  const handleMarkDelivered = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        
        const newDeliveryDate = format(new Date(), 'yyyy-MM-dd');
        
        // If not in manual override mode, auto-calculate next collection date
        if (!c.manualOverride) {
          const nextCollectionDate = format(addDays(new Date(), 14), 'yyyy-MM-dd');
          return {
            ...c,
            status: 'delivered' as const,
            deliveryDate: newDeliveryDate,
            deadline: nextCollectionDate,
          };
        }
        
        return { ...c, status: 'delivered' as const, deliveryDate: newDeliveryDate };
      })
    );
  };

  const handleToggleManualOverride = (id: string, enabled: boolean) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        
        // If disabling manual override, recalculate collection date from delivery date
        if (!enabled && c.deliveryDate) {
          const autoCollectionDate = format(addDays(new Date(c.deliveryDate), 14), 'yyyy-MM-dd');
          return {
            ...c,
            manualOverride: false,
            deadline: autoCollectionDate,
            status: c.status === 'waiting-for-call' ? 'pending' : c.status,
          };
        }
        
        return { ...c, manualOverride: enabled };
      })
    );
  };

  const handleUpdateCollection = (id: string, updates: Partial<ExtendedCollection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const filterCollections = (tab: 'today' | 'upcoming' | 'overdue' | 'running' | 'waiting') => {
    const today = new Date().toISOString().split('T')[0];
    switch (tab) {
      case 'today':
        return collections.filter(
          (c) => (c.deadline === today || c.deadline === '2025-01-25') && c.status === 'pending'
        );
      case 'upcoming':
        return collections.filter((c) => c.deadline > today && c.status === 'pending');
      case 'overdue':
        return collections.filter((c) => c.status === 'overdue');
      case 'running':
        return collections.filter((c) => c.status === 'collected');
      case 'waiting':
        return collections.filter((c) => c.status === 'waiting-for-call');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Collections"
        description="Manage your laundry collection and delivery schedule"
      />

      <main className="p-6 animate-fade-in">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="mb-6 bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-card">
              <Truck className="w-4 h-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="running" className="data-[state=active]:bg-card">
              <PlayCircle className="w-4 h-4 mr-2" />
              Running
              {filterCollections('running').length > 0 && (
                <Badge variant="scheduled" className="ml-2 h-5 min-w-5 px-1.5">
                  {filterCollections('running').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="waiting" className="data-[state=active]:bg-card">
              <Phone className="w-4 h-4 mr-2" />
              Waiting
              {filterCollections('waiting').length > 0 && (
                <Badge variant="warning" className="ml-2 h-5 min-w-5 px-1.5">
                  {filterCollections('waiting').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-card">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-card">
              Overdue
              {filterCollections('overdue').length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                  {filterCollections('overdue').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('today').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onMarkCollected={handleMarkCollected}
                  onMarkDelivered={handleMarkDelivered}
                  onToggleManualOverride={handleToggleManualOverride}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {filterCollections('today').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No collections scheduled for today.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="running" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('running').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onMarkCollected={handleMarkCollected}
                  onMarkDelivered={handleMarkDelivered}
                  onToggleManualOverride={handleToggleManualOverride}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {filterCollections('running').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No collections in progress.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="waiting" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('waiting').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onMarkCollected={handleMarkCollected}
                  onMarkDelivered={handleMarkDelivered}
                  onToggleManualOverride={handleToggleManualOverride}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {filterCollections('waiting').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <Phone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No collections waiting for property call.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('upcoming').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onMarkCollected={handleMarkCollected}
                  onMarkDelivered={handleMarkDelivered}
                  onToggleManualOverride={handleToggleManualOverride}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {filterCollections('upcoming').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming collections.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overdue" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('overdue').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onMarkCollected={handleMarkCollected}
                  onMarkDelivered={handleMarkDelivered}
                  onToggleManualOverride={handleToggleManualOverride}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {filterCollections('overdue').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
                <p className="text-muted-foreground">No overdue collections. Great work!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
