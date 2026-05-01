import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/UI";
import { AttendanceRecord, getAttendanceHistory } from "../services/attendanceService";

function formatDate(value: string) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export function AttendanceHistory() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAttendanceHistory().then(setRecords).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return records;
    }

    return records.filter((record) => `${record.attendance_date} ${record.status}`.toLowerCase().includes(term));
  }, [records, search]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Attendance History</h2>
        <p className="text-slate-500">View your past attendance records.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search records..."
              className="bg-white pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.attendance_date)}</TableCell>
                  <TableCell>{record.check_in || "-"}</TableCell>
                  <TableCell>{record.check_out || "-"}</TableCell>
                  <TableCell>{record.lat}</TableCell>
                  <TableCell>{record.lng}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={record.status === "present" ? "success" : "warning"}>{record.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
