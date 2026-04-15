import { 
  Filter, 
  Search,
  Calendar as CalendarIcon,
  ChevronDown
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Input } from "../components/UI";
import { motion } from "motion/react";

const RECORDS = [
  { id: 1, empId: "EMP-001", name: "Alice Johnson", date: "Oct 24, 2023", checkIn: "08:55 AM", checkOut: "05:05 PM", status: "Present", duration: "8h 10m" },
  { id: 2, empId: "EMP-002", name: "Bob Smith", date: "Oct 24, 2023", checkIn: "09:15 AM", checkOut: "05:30 PM", status: "Late", duration: "8h 15m" },
  { id: 3, empId: "EMP-004", name: "Diana Prince", date: "Oct 24, 2023", checkIn: "08:50 AM", checkOut: "05:00 PM", status: "Present", duration: "8h 10m" },
  { id: 4, empId: "EMP-005", name: "Evan Wright", date: "Oct 24, 2023", checkIn: "-", checkOut: "-", status: "Absent", duration: "-" },
  { id: 5, empId: "EMP-001", name: "Alice Johnson", date: "Oct 23, 2023", checkIn: "08:58 AM", checkOut: "05:10 PM", status: "Present", duration: "8h 12m" },
  { id: 6, empId: "EMP-002", name: "Bob Smith", date: "Oct 23, 2023", checkIn: "08:45 AM", checkOut: "04:55 PM", status: "Present", duration: "8h 10m" },
  { id: 7, empId: "EMP-003", name: "Charlie Davis", date: "Oct 23, 2023", checkIn: "09:20 AM", checkOut: "05:40 PM", status: "Late", duration: "8h 20m" },
];

export function RecordsReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Records & Reports</h2>
          <p className="text-slate-500">Comprehensive overview of company attendance records.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col border-b border-slate-100 bg-slate-50/50 pb-4 pt-4 px-6 gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search employee name or ID..."
                className="pl-9 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-white text-slate-600">
                <CalendarIcon className="h-4 w-4" />
                Oct 01 - Oct 31 <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-white text-slate-600">
                <Filter className="h-4 w-4" />
                Department: All <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-white text-slate-600">
                <Filter className="h-4 w-4" />
                Status: All <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECORDS.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{record.name}</span>
                      <span className="text-xs text-slate-500">{record.empId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">{record.date}</TableCell>
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
      
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Showing 7 of 2,431 records</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="px-2 self-center">...</span>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}