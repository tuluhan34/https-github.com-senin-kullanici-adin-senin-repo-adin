import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";
import Pagination from "../components/Pagination";

export default function LogsPage() {
  const [filters, setFilters] = useState({ level: "", action: "", entity: "", page: 1 });

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(filters.page),
      pageSize: "20"
    });

    if (filters.level) params.set("level", filters.level);
    if (filters.action) params.set("action", filters.action);
    if (filters.entity) params.set("entity", filters.entity);

    return params.toString();
  }, [filters]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["logs", queryString],
    queryFn: () => apiRequest(`/logs?${queryString}`)
  });

  function setFilterValue(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));
  }

  return (
    <AppLayout title="Logs">
      <section className="panel">
        <div className="toolbar">
          <input placeholder="Level" value={filters.level} onChange={(event) => setFilterValue("level", event.target.value)} />
          <input placeholder="Action" value={filters.action} onChange={(event) => setFilterValue("action", event.target.value)} />
          <input placeholder="Entity" value={filters.entity} onChange={(event) => setFilterValue("entity", event.target.value)} />
        </div>

        {isLoading ? <p>Loading logs...</p> : null}
        {error ? <p className="error">{error.message}</p> : null}

        {data ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Level</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>User</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.items.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.level}</td>
                      <td>{log.action}</td>
                      <td>{log.entity}</td>
                      <td>{log.user?.email || "system"}</td>
                      <td>{log.message}</td>
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
