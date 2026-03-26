import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExtendedCollection } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LayoutList } from 'lucide-react';

interface CollectionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: ExtendedCollection;
  itemIndex?: number | null;
}

export function CollectionDetailsModal({
  open,
  onOpenChange,
  collection,
  itemIndex = null,
}: CollectionDetailsModalProps) {
  const displayItems = itemIndex !== null && collection.items 
    ? [collection.items[itemIndex]] 
    : (collection.items || []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {itemIndex !== null ? `Item ${itemIndex + 1} Details` : 'Collection Details'} - {collection.propertyName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Property Address</Label>
                <p className="font-medium mt-1">{collection.propertyAddress}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium mt-1 capitalize">{collection.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Delivery Date</Label>
                <p className="font-medium mt-1">{collection.deliveryDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Collection Deadline</Label>
                <p className="font-medium mt-1">{collection.deadline}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 flex items-center justify-between">
                <span>{itemIndex !== null ? 'Selected Item' : 'Items List'}</span>
                <Badge variant="secondary" className="font-mono">
                  {itemIndex !== null ? '1 Item' : `Total: ${collection.items?.length || 0}`}
                </Badge>
              </h3>
              
              {displayItems.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {displayItems.map((item, index) => {
                    const actualIndex = itemIndex !== null ? itemIndex : index;
                    return (
                      <div 
                        key={`${item.id}-${actualIndex}`} 
                        className="bg-muted/30 rounded-xl p-5 border border-border/50 shadow-sm space-y-4 transition-all hover:bg-muted/40"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-[10px]">
                              {actualIndex + 1}
                            </span>
                            Item {actualIndex + 1}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded-full border border-border/50">
                            Added: {item.addedAt}
                          </span>
                        </div>
                        
                        {item.description && (
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Description</Label>
                            <p className="text-sm leading-relaxed text-foreground/90">{item.description}</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Quantities (Bed Categories)</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {Object.entries(item.quantities).map(([key, val]) => (
                              <div key={key} className="bg-background rounded-lg border border-border/40 p-2.5 text-center flex flex-col justify-center">
                                <p className="text-[9px] uppercase font-medium text-muted-foreground mb-1">{key}</p>
                                <p className="text-base font-bold text-foreground leading-none">{val}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {item.imagePreviews && item.imagePreviews.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Images</Label>
                            <div className="grid grid-cols-4 gap-3 mt-1">
                              {item.imagePreviews.map((preview, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border/50 group">
                                  <img
                                    src={preview}
                                    alt={`Item ${actualIndex + 1} image ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                  <LayoutList className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground italic">No specific items listed.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
