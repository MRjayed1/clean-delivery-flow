import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reports() {
  return (
    <div className="min-h-screen">
      <Header title="Reports" description="Analytics and insights for your operations" />

      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-2xl">156</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardDescription>On-Time Rate</CardDescription>
              <CardTitle className="text-2xl">94.2%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +2.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardDescription>Avg. Response Time</CardDescription>
              <CardTitle className="text-2xl">2.4 hrs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">For early requests</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardDescription>Active Properties</CardDescription>
              <CardTitle className="text-2xl">24</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across 4 employees</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Collections Overview</h3>
                <p className="text-sm text-muted-foreground">Last 30 days performance</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization would appear here
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Employee Performance</h3>
                <p className="text-sm text-muted-foreground">Tasks completed this month</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Maria Garcia', completed: 45, onTime: 98 },
                { name: 'Carlos Rodriguez', completed: 38, onTime: 92 },
                { name: 'Ana Martinez', completed: 42, onTime: 95 },
                { name: 'Jose Hernandez', completed: 31, onTime: 88 },
              ].map((employee, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {employee.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{employee.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {employee.completed} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${employee.onTime}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-success">{employee.onTime}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Monthly Schedule</h3>
              <p className="text-sm text-muted-foreground">Upcoming collections calendar</p>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              View Full Calendar
            </Button>
          </div>
          <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Calendar view would appear here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
