import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  category: "",
  status: "PENDING",
  amount: 0,
  description: ""
};

export default function DataPage() {
  const { user, csrfToken } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(filters.page),
      pageSize: "10"
    });

    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);

    return params.toString();
  }, [filters]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["records", queryString],
    queryFn: () => apiRequest(`/data?${queryString}`)
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        ...form,
        amount: Number(form.amount),
        description: form.description || null
      };

      if (editingId) {
        return apiRequest(`/data/${editingId}`, {
          method: "PATCH",
          csrfToken,
          body
        });
      }

      return apiRequest("/data", {
        method: "POST",
        csrfToken,
        body
      });
    },
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest(`/data/${id}`, { method: "DELETE", csrfToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
    }
  });

  function setFilterValue(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));
  }

  function startEdit(record) {
    setEditingId(record.id);
    setForm({
      title: record.title,
      category: record.category,
      status: record.status,
      amount: record.amount,
      description: record.description || ""
    });
  }

  return (
    <AppLayout title="Data Management">
      <section className="panel form-panel">
        <h3>{editingId ? "Edit data record" : "Create data record"}</h3>
        <div className="form-grid">
          <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder="Amount"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
        </div>
        {saveMutation.error ? <p className="error">{saveMutation.error.message}</p> : null}
      </section>

      <section className="panel">
        <div className="toolbar">
          <input placeholder="Search title/description" value={filters.search} onChange={(event) => setFilterValue("search", event.target.value)} />
          <select value={filters.status} onChange={(event) => setFilterValue("status", event.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        {isLoading ? <p>Loading records...</p> : null}
        {error ? <p className="error">{error.message}</p> : null}

        {data ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.items.map((record) => (
                    <tr key={record.id}>
                      <td>{record.title}</td>
                      <td>{record.category}</td>
                      <td>{record.status}</td>
                      <td>{Number(record.amount).toLocaleString()}</td>
                      <td>{record.createdBy?.email || "unknown"}</td>
                      <td className="table-actions">
                        <button type="button" onClick={() => startEdit(record)}>
                          Edit
                        </button>
                        {user?.role === "ADMIN" ? (
                          <button type="button" className="danger" onClick={() => deleteMutation.mutate(record.id)}>
                            Delete
                          </button>
                        ) : null}
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
