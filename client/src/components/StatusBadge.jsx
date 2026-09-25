import { STATUS_LABELS, STATUS_COLORS } from "../utils/constants";

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  // Fallback class if not found
  const colorClass = STATUS_COLORS[status] || "text-gray-600";

  return (
    <span className={`font-bold ${colorClass}`}>
      {label}
    </span>
  );
}
