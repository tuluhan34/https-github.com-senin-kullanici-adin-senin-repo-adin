import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import AppLayout from "../components/AppLayout";

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-data"],
    queryFn: async () => {
      const summary = await apiRequest("/dashboard/summary");
      const records = await apiRequest("/data?page=1&pageSize=100");
      return {
        summary: summary.data,
        records: records.data.items
      };
    }
  });

  const categoryMap = data ? groupBy(data.records, "category") : {};
  const statusMap = data ? groupBy(data.records, "status") : {};

  return (
    <AppLayout title="Analytics">
      {isLoading ? <p>Loading analytics...</p> : null}
      {error ? <p className="error">{error.message}</p> : null}

      {data ? (
        <section className="cards-grid two-col">
          <article className="panel">
            <h3>Records by Category</h3>
            <ul className="simple-list">
              {Object.entries(categoryMap).map(([category, count]) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h3>Records by Status</h3>
            <ul className="simple-list">
              {Object.entries(statusMap).map(([status, count]) => (
                <li key={status}>
                  <span>{status}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h3>Quick Summary</h3>
            <p>Total users: {data.summary.userCount}</p>
            <p>Active users: {data.summary.activeUserCount}</p>
            <p>Total records: {data.summary.dataRecordCount}</p>
            <p>Total amount: {Number(data.summary.totalAmount).toLocaleString()}</p>
          </article>
        </section>
      ) : null}
    </AppLayout>
  );
}
