export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
