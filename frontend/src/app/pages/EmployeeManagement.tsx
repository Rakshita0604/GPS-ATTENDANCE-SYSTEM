import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Input } from "../components/UI";
import { motion, AnimatePresence } from "motion/react";

const EMPLOYEES = [
  { id: "EMP-001", name: "Alice Johnson", email: "alice.j@company.com", role: "Software Engineer", status: "Active", joinDate: "Jan 12, 2022" },
  { id: "EMP-002", name: "Bob Smith", email: "bob.smith@company.com", role: "Product Manager", status: "Active", joinDate: "Mar 05, 2021" },
  { id: "EMP-003", name: "Charlie Davis", email: "charlie.d@company.com", role: "UX Designer", status: "Inactive", joinDate: "Jul 22, 2023" },
  { id: "EMP-004", name: "Diana Prince", email: "diana.p@company.com", role: "QA Lead", status: "Active", joinDate: "Nov 15, 2020" },
  { id: "EMP-005", name: "Evan Wright", email: "evan.w@company.com", role: "Frontend Developer", status: "Active", joinDate: "Feb 01, 2023" },
];

export function EmployeeManagement() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h2>
          <p className="text-slate-500">Manage your workforce, roles, and system access.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4" />
            {isAdding ? "Cancel Adding" : "Add Employee"}
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-indigo-100 shadow-indigo-50/50">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Full Name</label>
                <Input placeholder="e.g. John Doe" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Email Address</label>
                <Input type="email" placeholder="john@company.com" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Role</label>
                <Input placeholder="e.g. Software Engineer" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Employee ID</label>
                <Input placeholder="EMP-XXX" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Department</label>
                <Input placeholder="e.g. Engineering" />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="button">Save Employee</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-slate-50/50 pb-4 pt-4 px-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="pl-9 bg-white"
            />
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-slate-500">
            Showing 5 of 142 employees
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYEES.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium text-slate-600">{emp.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{emp.name}</span>
                      <span className="text-xs text-slate-500">{emp.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{emp.role}</TableCell>
                  <TableCell className="text-slate-500">{emp.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === "Active" ? "success" : "secondary"}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Page 1 of 29</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}