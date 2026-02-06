import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockCollections, ExtendedCollection } from '@/lib/mockData';
import { CollectionCard } from '@/components/collections/CollectionCard';

export default function Collections() {
  const [collections, setCollections] = useState<ExtendedCollection[]>(mockCollections);

  const handleUpdateCollection = (id: string, updates: Partial<ExtendedCollection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const filterCollections = (section: 'running' | 'upcoming' | 'overdue') => {
    return collections
      .filter((c) => c.status === section)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  };

  const runningCount = filterCollections('running').length;
  const upcomingCount = filterCollections('upcoming').length;
  const overdueCount = filterCollections('overdue').length;

  return (
    <div className="min-h-screen">
      <Header
        title="Collections"
        description="Operations scheduling dashboard for laundry logistics"
      />

      <main className="p-6 animate-fade-in">
        <Tabs defaultValue="running" className="w-full">
          <TabsList className="mb-6 bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="running" className="data-[state=active]:bg-card">
              <PlayCircle className="w-4 h-4 mr-2" />
              Running
              {runningCount > 0 && (
                <Badge variant="scheduled" className="ml-2 h-5 min-w-5 px-1.5">
                  {runningCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-card">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming
              {upcomingCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                  {upcomingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-card">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Overdue
              {overdueCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                  {overdueCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="running" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('running').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {runningCount === 0 && (
              <div className="text-center py-12 dashboard-card">
                <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active jobs in cycle.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('upcoming').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {upcomingCount === 0 && (
              <div className="text-center py-12 dashboard-card">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming scheduled collections.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overdue" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCollections('overdue').map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onUpdateCollection={handleUpdateCollection}
                />
              ))}
            </div>
            {overdueCount === 0 && (
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
