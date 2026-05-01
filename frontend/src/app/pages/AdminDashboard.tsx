import { useEffect, useState } from "react";
import { Map, Save, Settings, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "../components/UI";
import { getDashboardData, getOfficeLocation, saveOfficeLocation } from "../services/attendanceService";

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, lateToday: 0 });
  const [location, setLocation] = useState({ lat: "", lng: "", radius: "150" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDashboardData().then(setStats).catch(() => toast.error("Failed to load dashboard"));
    getOfficeLocation()
      .then((data) =>
        setLocation({
          lat: String(data.lat || ""),
          lng: String(data.lng || ""),
          radius: String(data.radius || "150"),
        })
      )
      .catch(() => undefined);
  }, []);

  const updateLocation = (field: keyof typeof location, value: string) => {
    setLocation((current) => ({ ...current, [field]: value }));
  };

  const handleSaveLocation = async () => {
    setSaving(true);

    try {
      const response = await saveOfficeLocation(location);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Present Today", value: stats.presentToday, icon: UserCheck, color: "text-teal-500", bg: "bg-teal-50" },
    { title: "Late Today", value: stats.lateToday, icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500">Company attendance overview and office location settings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-indigo-600" />
              Office Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Office Latitude</label>
              <Input value={location.lat} onChange={(event) => updateLocation("lat", event.target.value)} placeholder="e.g. 12.971599" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Office Longitude</label>
              <Input value={location.lng} onChange={(event) => updateLocation("lng", event.target.value)} placeholder="e.g. 77.594566" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Allowed Radius (meters)</label>
              <Input type="number" value={location.radius} onChange={(event) => updateLocation("radius", event.target.value)} />
            </div>
            <Button type="button" className="w-full gap-2" onClick={handleSaveLocation} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                System Status
              </span>
              <Badge variant="success">Online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm font-medium text-slate-900">Backend API</p>
              <p className="text-xs text-slate-500">Connected to http://localhost:5000</p>
            </div>
            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm font-medium text-slate-900">Authentication</p>
              <p className="text-xs text-slate-500">JWT protected admin and employee routes are active.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
