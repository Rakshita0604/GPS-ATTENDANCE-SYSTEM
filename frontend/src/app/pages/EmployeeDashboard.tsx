import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, MapPin, TrendingUp, XCircle } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/UI";
import { getAttendanceHistory, getDashboardData, AttendanceRecord } from "../services/attendanceService";
import { getCurrentUser } from "../services/authService";

function formatDate(value: string) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export function EmployeeDashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    getDashboardData().then(setStats).catch(() => undefined);
    getAttendanceHistory()
      .then((data) => setAttendance(data.slice(0, 5)))
      .catch(() => undefined);
  }, []);

  const summary = [
    { title: "Present Days", value: stats.present, icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50" },
    { title: "Absent Days", value: stats.absent, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    { title: "Late Entries", value: stats.late, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Total Records", value: stats.total, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome, {user?.name || "Employee"}</h2>
          <p className="text-slate-500">Here is your attendance summary.</p>
        </div>
        <Button asChild>
          <Link to="/app/mark-attendance" className="gap-2">
            <MapPin className="h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summary.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <p className="text-sm text-slate-600">{stat.title}</p>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 font-semibold text-slate-900">Current Shift</h3>
            <Button className="mt-4 w-full gap-2" asChild>
              <Link to="/app/mark-attendance">
                Check In <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500">
                      No attendance records yet
                    </TableCell>
                  </TableRow>
                )}
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.attendance_date)}</TableCell>
                    <TableCell>{record.check_in || "-"}</TableCell>
                    <TableCell>{record.check_out || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === "present" ? "success" : "warning"}>{record.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
