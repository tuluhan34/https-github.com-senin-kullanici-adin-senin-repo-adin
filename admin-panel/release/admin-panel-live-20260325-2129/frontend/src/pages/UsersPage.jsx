import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { csrfToken } = useAuth();
  const [filters, setFilters] = useState({ search: "", role: "", page: 1 });
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER", isActive: true });
  const [editingId, setEditingId] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(filters.page),
      pageSize: "10"
    });

    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);

    return params.toString();
  }, [filters]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", queryString],
    queryFn: () => apiRequest(`/users?${queryString}`)
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (editingId) {
        return apiRequest(`/users/${editingId}`, {
          method: "PATCH",
          csrfToken,
          body: {
            name: form.name,
            role: form.role,
            isActive: form.isActive,
            ...(form.password ? { password: form.password } : {})
          }
        });
      }

      return apiRequest("/users", {
        method: "POST",
        csrfToken,
        body: form
      });
    },
    onSuccess: () => {
      setForm({ name: "", email: "", password: "", role: "USER", isActive: true });
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest(`/users/${id}`, { method: "DELETE", csrfToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    }
  });

  function setFilterValue(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));
  }

  function startEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive
    });
  }

  return (
    <AppLayout title="User Management">
      <section className="panel form-panel">
        <h3>{editingId ? "Edit user" : "Create user"}</h3>
        <div className="form-grid">
          <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            disabled={Boolean(editingId)}
          />
          <input
            placeholder={editingId ? "New password (optional)" : "Password"}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            Active
          </label>
          <button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
        </div>
        {saveMutation.error ? <p className="error">{saveMutation.error.message}</p> : null}
      </section>

      <section className="panel">
        <div className="toolbar">
          <input
            placeholder="Search name or email"
            value={filters.search}
            onChange={(event) => setFilterValue("search", event.target.value)}
          />
          <select value={filters.role} onChange={(event) => setFilterValue("role", event.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </div>

        {isLoading ? <p>Loading users...</p> : null}
        {error ? <p className="error">{error.message}</p> : null}

        {data ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.items.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{String(user.isActive)}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="table-actions">
                        <button type="button" onClick={() => startEdit(user)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteMutation.mutate(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={data.data.pagination.page}
              totalPages={data.data.pagination.totalPages}
              onChange={(page) => setFilterValue("page", page)}
            />
          </>
        ) : null}
      </section>
    </AppLayout>
  );
}
