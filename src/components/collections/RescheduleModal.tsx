import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ExtendedCollection } from '@/lib/mockData';

interface RescheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: ExtendedCollection;
  onSave: (updates: Partial<ExtendedCollection>) => void;
}

export function RescheduleModal({ open, onOpenChange, collection, onSave }: RescheduleModalProps) {
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
    collection.deliveryDate ? new Date(collection.deliveryDate) : undefined
  );
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(
    collection.deadline ? new Date(collection.deadline) : undefined
  );
  const [leaveCollectionEmpty, setLeaveCollectionEmpty] = useState(false);

  const handleSave = () => {
    const updates: Partial<ExtendedCollection> = {
      deliveryDate: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : undefined,
      deadline: leaveCollectionEmpty ? '' : (collectionDate ? format(collectionDate, 'yyyy-MM-dd') : collection.deadline),
      manualOverride: true,
      status: leaveCollectionEmpty ? 'waiting-for-call' : collection.status,
    };
    
    onSave(updates);
    onOpenChange(false);
  };

  const handleAutoCalculate = () => {
    if (deliveryDate) {
      setCollectionDate(addDays(deliveryDate, 14));
      setLeaveCollectionEmpty(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Collection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : <span>Select delivery date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Collection Date</Label>
              {deliveryDate && (
                <Button variant="link" size="sm" onClick={handleAutoCalculate} className="h-auto p-0 text-xs">
                  Auto-calculate (+14 days)
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="leave-empty"
                checked={leaveCollectionEmpty}
                onCheckedChange={(checked) => setLeaveCollectionEmpty(checked === true)}
              />
              <label htmlFor="leave-empty" className="text-sm text-muted-foreground cursor-pointer">
                Leave empty (Waiting for Property Call)
              </label>
            </div>
            
            {!leaveCollectionEmpty && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !collectionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {collectionDate ? format(collectionDate, "PPP") : <span>Select collection date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={collectionDate}
                    onSelect={setCollectionDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Saving will enable Manual Override mode for this collection.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
