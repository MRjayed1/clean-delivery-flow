import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlayCircle, Calendar, AlertTriangle, CheckCircle, Search, X } from 'lucide-react';
import { mockCollections, ExtendedCollection } from '@/lib/mockData';
import { CollectionCard } from '@/components/collections/CollectionCard';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'running';
  
  const [collections, setCollections] = useState<ExtendedCollection[]>([...mockCollections]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      // Create a stringified version of the data we care about for a deep comparison
      const getComparisonString = (data: ExtendedCollection[]) => 
        data.map(c => `${c.id}-${c.status}-${c.items?.length || 0}`).join('|');
      
      const mockStr = getComparisonString(mockCollections);
      const currentStr = getComparisonString(collections);
      
      if (mockStr !== currentStr) {
        // Use a functional update and deep clone to ensure React detects the change
        setCollections([...mockCollections].map(c => ({
          ...c,
          items: c.items ? [...c.items.map(item => ({ ...item, quantities: { ...item.quantities } }))] : []
        })));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [collections]);

  const handleUpdateCollection = (id: string, updates: Partial<ExtendedCollection>) => {
    // Update local state
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    
    // Also update mockCollections to keep it in sync for other pages
    const index = mockCollections.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCollections[index] = { ...mockCollections[index], ...updates };
    }
  };

  const filterCollections = (section: 'running' | 'upcoming' | 'overdue') => {
    return collections
      .filter((c) => {
        const matchesStatus = c.status === section;
        const matchesSearch = 
          c.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search property or address..."
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {searchTerm && (
            <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap px-2">
              Found {filterCollections('running').length + filterCollections('upcoming').length + filterCollections('overdue').length} results
            </div>
          )}
        </div>

        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
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
            {filterCollections('running').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">No properties matching "{searchTerm}" in running cycle.</p>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active jobs in cycle.</p>
                  </>
                )}
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
            {filterCollections('upcoming').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">No properties matching "{searchTerm}" in upcoming.</p>
                  </>
                ) : (
                  <>
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No upcoming scheduled collections.</p>
                  </>
                )}
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
            {filterCollections('overdue').length === 0 && (
              <div className="text-center py-12 dashboard-card">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">No properties matching "{searchTerm}" in overdue.</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
                    <p className="text-muted-foreground">No overdue collections. Great work!</p>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
