import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reports = [
  {
    id: 'collections',
    title: 'Collections Report',
    description: 'Track all collection jobs and their status',
    icon: Package,
    count: 156,
    period: 'This month',
  },
  {
    id: 'delivery',
    title: 'Delivery Report',
    description: 'Monitor delivery schedules and completions',
    icon: Truck,
    count: 142,
    period: 'This month',
  },
  {
    id: 'missing',
    title: 'Missing Report',
    description: 'View missing or unaccounted items',
    icon: AlertTriangle,
    count: 8,
    period: 'This month',
  },
];

export default function Reports() {
  return (
    <div className="min-h-screen">
      <Header title="Reports" description="View and export operational reports" />

      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="dashboard-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-1">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">{report.count}</span>
                    <span className="text-sm text-muted-foreground">{report.period}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
