export default function StatCard({ title, value }) {
  return (
    <article className="stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </article>
  );
}
