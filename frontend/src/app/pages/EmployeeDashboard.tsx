import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/UI";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  getDashboardData,
  getAttendanceHistory,
} from "../services/attendanceService";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function EmployeeDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return;

    // 🔥 FETCH DASHBOARD DATA
    getDashboardData(user.id).then((data) => {
      setStats(data);
    });

    // 🔥 FETCH ATTENDANCE HISTORY
    getAttendanceHistory(user.id).then((data) => {
      setAttendance(data.slice(0, 5)); // latest 5
    });
  }, []);

  const SUMMARY_DATA = [
    {
      title: "Present Days",
      value: stats?.present || 0,
      icon: CheckCircle2,
      color: "text-teal-500",
      bg: "bg-teal-50",
    },
    {
      title: "Absent Days",
      value: stats?.absent || 0,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Late Entries",
      value: stats?.late || 0,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Avg. Hours",
      value: "8.0h", // optional later
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Good morning 👋
          </h2>
          <p className="text-slate-500">
            Here is your attendance summary.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/app/history">View History</Link>
          </Button>

          <Button variant="success" asChild>
            <Link to="/app/mark-attendance">
              <MapPin className="h-4 w-4" />
              Mark Attendance
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {SUMMARY_DATA.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* TABLE */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-2 p-6 text-center border-dashed border-2">
          <Clock className="h-10 w-10 mx-auto text-indigo-600" />
          <h3 className="mt-4 font-semibold">Current Shift</h3>
          <Button className="mt-4 w-full" asChild>
            <Link to="/app/mark-attendance">
              Check In <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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
                {attendance.map((rec, i) => (
                  <TableRow key={i}>
                    <TableCell>{rec.date}</TableCell>
                    <TableCell>{rec.check_in || "-"}</TableCell>
                    <TableCell>{rec.check_out || "-"}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          rec.status === "present"
                            ? "success"
                            : rec.status === "late"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {rec.status}
                      </Badge>
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