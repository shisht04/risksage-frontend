/**
 * Shared tooltip for every dashboard chart.
 *
 * Recharts' default tooltip colors the text with the series or slice
 * fill, so a dark fill prints dark text on the dark tooltip background
 * (for example the "Low" slice of the risk donut was unreadable). This
 * one keeps every word white and uses the fill only for the small dot.
 */
export default function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    fill?: string;
    payload?: { fill?: string };
  }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-white/15 bg-[#0f1f10] px-3 py-2 text-xs text-white shadow-xl">
      {label !== undefined && label !== null && label !== "" && (
        <p className="mb-1 font-medium text-white">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-1.5 whitespace-nowrap">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              background:
                entry.color || entry.fill || entry.payload?.fill || "#c6f19d",
            }}
          />
          {entry.name ? (
            <span className="text-[#9aa39a]">{entry.name}:</span>
          ) : null}
          <span className="font-mono-code font-medium text-white">
            {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}
