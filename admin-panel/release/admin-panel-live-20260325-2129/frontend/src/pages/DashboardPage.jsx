import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiRequest("/dashboard/summary")
  });

  return (
    <AppLayout title="Dashboard">
      {isLoading ? <p>Loading dashboard...</p> : null}
      {error ? <p className="error">{error.message}</p> : null}

      {data ? (
        <>
          <section className="cards-grid">
            <StatCard title="Total Users" value={data.data.userCount} />
            <StatCard title="Active Users" value={data.data.activeUserCount} />
            <StatCard title="Data Records" value={data.data.dataRecordCount} />
            <StatCard title="Total Amount" value={`$${Number(data.data.totalAmount).toLocaleString()}`} />
          </section>

          <section className="panel">
            <h3>Latest System Logs</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>User</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.latestLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.action}</td>
                      <td>{log.entity}</td>
                      <td>{log.user?.email || "system"}</td>
                      <td>{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </AppLayout>
  );
}
