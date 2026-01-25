import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Building2, Calendar } from 'lucide-react';
import { mockEmployees } from '@/lib/mockData';

export default function Employees() {
  return (
    <div className="min-h-screen">
      <Header title="Employees" description="Manage your team members and assignments" />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="active">
              {mockEmployees.filter((e) => e.status === 'active').length} Active
            </Badge>
            <Badge variant="offline">
              {mockEmployees.filter((e) => e.status === 'offline').length} Offline
            </Badge>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockEmployees.map((employee) => (
            <div
              key={employee.id}
              className="dashboard-card hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{employee.name}</h3>
                    <Badge
                      variant={employee.status === 'active' ? 'active' : 'offline'}
                      className="mt-1"
                    >
                      {employee.status === 'active' ? 'Active' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {employee.assignedProperties} properties assigned
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {employee.todaysTasks} tasks today
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
