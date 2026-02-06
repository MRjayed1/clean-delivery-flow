import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { OverdueTable } from '@/components/dashboard/OverdueTable';
import { Building2, CheckCircle, Clock, AlertTriangle, Calendar, Briefcase } from 'lucide-react';
import { dashboardStats, mockProperties } from '@/lib/mockData';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        description="Welcome back! Here's an overview of your operations."
      />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Companies"
            value={dashboardStats.totalCompanies}
            icon={Briefcase}
          />
          <StatCard
            title="Total Properties"
            value={dashboardStats.totalProperties}
            icon={Building2}
          />
          <StatCard
            title="Active Properties"
            value={dashboardStats.activeProperties}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Pending Collections"
            value={dashboardStats.pendingCollections}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Overdue Collections"
            value={dashboardStats.overdueCollections}
            icon={AlertTriangle}
            variant="destructive"
          />
          <StatCard
            title="Today's Pickups"
            value={dashboardStats.todaysPickups}
            icon={Calendar}
          />
        </div>

        {/* Overdue Properties Table */}
        <OverdueTable properties={mockProperties} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Collection completed', property: 'Beachfront Villa', time: '2 hours ago', type: 'success' },
                { action: 'New request submitted', property: 'Sunset Apartment', time: '3 hours ago', type: 'info' },
                { action: 'Employee assigned', property: 'Harbor View Suite', time: '5 hours ago', type: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-success' : 'bg-primary'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.property}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Employee Status</h3>
            <div className="space-y-4">
              {[
                { name: 'Maria Garcia', tasks: 3, status: 'active' },
                { name: 'Carlos Rodriguez', tasks: 2, status: 'active' },
                { name: 'Ana Martinez', tasks: 4, status: 'active' },
                { name: 'Jose Hernandez', tasks: 0, status: 'offline' },
              ].map((employee, index) => (
                <div key={index} className="flex items-center gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {employee.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.tasks} tasks today</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs ${
                      employee.status === 'active' ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        employee.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                    {employee.status === 'active' ? 'Active' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
