import { 
  Filter,
  Search,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Input } from "../components/UI";
import { motion } from "motion/react";

const HISTORY_DATA = [
  { id: 1, date: "Oct 24, 2023", checkIn: "08:55 AM", checkOut: "05:05 PM", status: "Present", duration: "8h 10m" },
  { id: 2, date: "Oct 23, 2023", checkIn: "09:15 AM", checkOut: "05:30 PM", status: "Late", duration: "8h 15m" },
  { id: 3, date: "Oct 22, 2023", checkIn: "08:50 AM", checkOut: "05:00 PM", status: "Present", duration: "8h 10m" },
  { id: 4, date: "Oct 21, 2023", checkIn: "-", checkOut: "-", status: "Absent", duration: "-" },
  { id: 5, date: "Oct 20, 2023", checkIn: "08:58 AM", checkOut: "05:10 PM", status: "Present", duration: "8h 12m" },
  { id: 6, date: "Oct 19, 2023", checkIn: "08:45 AM", checkOut: "04:55 PM", status: "Present", duration: "8h 10m" },
  { id: 7, date: "Oct 18, 2023", checkIn: "09:20 AM", checkOut: "05:40 PM", status: "Late", duration: "8h 20m" },
];

export function AttendanceHistory() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Attendance History</h2>
          <p className="text-slate-500">View and filter your past attendance records.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-slate-50/50 pb-4 pt-4 px-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search date..."
                  className="pl-9 bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
                <CalendarIcon className="h-4 w-4 text-slate-500" />
                This Month
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
                <Filter className="h-4 w-4 text-slate-500" />
                Filter Status
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px]">Date</TableHead>
                  <TableHead>Check In Time</TableHead>
                  <TableHead>Check Out Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HISTORY_DATA.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-slate-900">{record.date}</TableCell>
                    <TableCell className="text-slate-600">{record.checkIn}</TableCell>
                    <TableCell className="text-slate-600">{record.checkOut}</TableCell>
                    <TableCell className="text-slate-500">{record.duration}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          record.status === "Present" ? "success" : 
                          record.status === "Late" ? "warning" : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Showing 1 to 7 of 32 entries</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </motion.div>
  );
}