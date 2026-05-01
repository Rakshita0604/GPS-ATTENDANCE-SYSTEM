import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/UI";
import {
  createEmployee,
  deleteEmployee,
  Employee,
  EmployeeInput,
  getEmployees,
  updateEmployee,
} from "../services/employeeService";

const emptyForm: EmployeeInput = {
  employee_code: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  status: "active",
  password: "Employee@123",
};

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<EmployeeInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return employees;
    }

    return employees.filter((employee) =>
      [employee.employee_code, employee.name, employee.email, employee.department, employee.designation]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [employees, search]);

  const loadEmployees = async () => {
    setLoading(true);

    try {
      setEmployees(await getEmployees());
    } catch (error: any) {
      toast.error(error?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const updateField = (field: keyof EmployeeInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setShowForm(true);
    setForm({
      employee_code: employee.employee_code,
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      status: employee.status,
      password: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        toast.success("Employee updated");
      } else {
        await createEmployee(form);
        toast.success("Employee added");
      }

      resetForm();
      await loadEmployees();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save employee");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) {
      return;
    }

    try {
      await deleteEmployee(employee.id);
      toast.success("Employee deleted");
      await loadEmployees();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
          <p className="text-slate-500">Manage employee records and account access.</p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            setShowForm((value) => !value);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Close" : "Add Employee"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Employee" : "Add Employee"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Employee ID</label>
                <Input value={form.employee_code} onChange={(event) => updateField("employee_code", event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Full Name</label>
                <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Email</label>
                <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Phone</label>
                <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Department</label>
                <Input value={form.department} onChange={(event) => updateField("department", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Designation</label>
                <Input value={form.designation} onChange={(event) => updateField("designation", event.target.value)} />
              </div>
              {!editingId && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-900">Initial Password</label>
                  <Input value={form.password} onChange={(event) => updateField("password", event.target.value)} required />
                </div>
              )}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-900">Status</label>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end justify-end gap-2 md:col-span-2 lg:col-span-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Employee"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="bg-white pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <p className="text-sm text-slate-500">{filteredEmployees.length} employees</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    Loading employees...
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No employees found
                  </TableCell>
                </TableRow>
              )}

              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium text-slate-700">{employee.employee_code}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{employee.name}</span>
                      <span className="text-xs text-slate-500">{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department || "-"}</TableCell>
                  <TableCell>{employee.designation || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "success" : "secondary"}>{employee.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(employee)}>
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
    </div>
  );
}
