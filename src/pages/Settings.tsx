import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen">
      <Header title="Settings" description="Manage your application preferences" />

      <main className="p-6 space-y-6 animate-fade-in max-w-3xl">
        {/* Company Settings */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="LaundryOps Miami" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" defaultValue="admin@laundryops.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (305) 555-0000" />
            </div>
          </div>
        </div>

        {/* Collection Settings */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Collection Settings</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="collection-days">Days After Delivery for Collection</Label>
              <Select defaultValue="14">
                <SelectTrigger id="collection-days" className="w-full bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="10">10 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Collection will be automatically scheduled this many days after delivery
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Overdue Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for overdue collections
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Send daily summary email at 8:00 AM
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email for new requests
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS to employees for assignments
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
