import { Users, UserCheck, UserMinus, TrendingUp, Map, Settings, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from "../components/UI";
import { motion } from "motion/react";

const STATS = [
  { title: "Total Employees", value: "142", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  { title: "Present Today", value: "128", icon: UserCheck, color: "text-teal-500", bg: "bg-teal-50" },
  { title: "Absent Today", value: "5", icon: UserMinus, color: "text-red-500", bg: "bg-red-50" },
  { title: "On Leave", value: "9", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500">Overview of company-wide attendance and system metrics.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {STATS.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Geofencing Configuration */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-indigo-600" />
              Geo-Fencing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6 pt-6">
            <p className="text-sm text-slate-500">
              Set the required GPS coordinates and radius for employee check-in verification.
            </p>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Office Latitude</label>
                <Input defaultValue="37.7749" placeholder="e.g., 37.7749" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Office Longitude</label>
                <Input defaultValue="-122.4194" placeholder="e.g., -122.4194" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Allowed Radius (meters)</label>
                <Input type="number" defaultValue="150" placeholder="e.g., 100" />
              </div>
            </div>

            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                System Status
              </span>
              <Badge variant="success">Online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { title: "Database Sync", status: "Healthy", time: "2 mins ago" },
                { title: "GPS Service APIs", status: "Healthy", time: "1 min ago" },
                { title: "Email Notifications", status: "Warning", time: "15 mins ago" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{service.title}</p>
                    <p className="text-xs text-slate-500">Last updated: {service.time}</p>
                  </div>
                  <Badge variant={service.status === "Healthy" ? "success" : "warning"}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-6 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">Upcoming Maintenance</h4>
              <p className="text-xs text-indigo-700">Scheduled for Sunday, Oct 29 at 02:00 AM PST. Expected downtime is 30 minutes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}