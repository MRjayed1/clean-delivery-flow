import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MapPin, Calendar, Truck } from 'lucide-react';
import { mockCollections, Collection } from '@/lib/mockData';

export default function Collections() {
  const [collections, setCollections] = useState(mockCollections);

  const handleMarkCollected = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'completed' as const } : c))
    );
  };

  const filterCollections = (status: 'today' | 'upcoming' | 'overdue') => {
    const today = new Date().toISOString().split('T')[0];
    switch (status) {
      case 'today':
        return collections.filter(
          (c) => c.deadline === today || c.deadline === '2025-01-25'
        );
      case 'upcoming':
        return collections.filter((c) => c.deadline > today && c.status === 'pending');
      case 'overdue':
        return collections.filter((c) => c.status === 'overdue');
    }
  };

  const getStatusBadge = (status: Collection['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="pending">Pending</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'overdue':
        return <Badge variant="overdue">Overdue</Badge>;
    }
  };

  const getPriorityBadge = (priority: Collection['priority']) => {
    switch (priority) {
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
    }
  };

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <div className="dashboard-card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusBadge(collection.status)}
          {getPriorityBadge(collection.priority)}
        </div>
        <Badge variant={collection.collectionType === 'scheduled' ? 'scheduled' : 'warning'}>
          {collection.collectionType === 'scheduled' ? 'Scheduled' : 'Early Request'}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
          <p className="text-sm text-foreground">{collection.propertyAddress}</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Deadline: {collection.deadline}</p>
        </div>
      </div>

      {collection.status !== 'completed' && (
        <Button
          className="w-full mt-4"
          variant={collection.status === 'overdue' ? 'destructive' : 'default'}
          onClick={() => handleMarkCollected(collection.id)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Collected
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Collections"
        description="Manage your laundry collection schedule"
      />

      <main className="p-6 animate-fade-in">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="today" className="data-[state=active]:bg-card">
              <Truck className="w-4 h-4 mr-2" />
              Today
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
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            {filterCollections('today').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No collections scheduled for today.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('upcoming').map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
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
                <CollectionCard key={collection.id} collection={collection} />
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
