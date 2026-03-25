import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { csrfToken } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ key: "", value: "", description: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiRequest("/settings")
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      apiRequest("/settings", {
        method: "POST",
        csrfToken,
        body: {
          ...form,
          description: form.description || null
        }
      }),
    onSuccess: () => {
      setForm({ key: "", value: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (key) => apiRequest(`/settings/${key}`, { method: "DELETE", csrfToken }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] })
  });

  return (
    <AppLayout title="Settings">
      <section className="panel form-panel">
        <h3>Create or update setting</h3>
        <div className="form-grid">
          <input placeholder="Key" value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} />
          <input placeholder="Value" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save setting"}
          </button>
        </div>
        {saveMutation.error ? <p className="error">{saveMutation.error.message}</p> : null}
      </section>

      <section className="panel">
        {isLoading ? <p>Loading settings...</p> : null}
        {error ? <p className="error">{error.message}</p> : null}

        {data ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Updated By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.key}</td>
                    <td>{item.value}</td>
                    <td>{item.description}</td>
                    <td>{item.updatedBy?.email || "-"}</td>
                    <td className="table-actions">
                      <button type="button" onClick={() => setForm({ key: item.key, value: item.value, description: item.description || "" })}>
                        Fill Form
                      </button>
                      <button type="button" className="danger" onClick={() => deleteMutation.mutate(item.key)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
