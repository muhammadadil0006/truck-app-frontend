/** Small label-over-value pair for the paper log's metadata grid — teal
 * caption + dark value, replacing what used to be run-on "Label: value"
 * sentences. */
export function PaperField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold tracking-wider text-teal-700 uppercase">{label}</p>
      <p className="truncate text-xs font-medium text-ink-800">{value}</p>
    </div>
  );
}
