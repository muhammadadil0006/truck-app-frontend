/** Eyebrow + title + subtitle for the trip history page. */
export function TripHistoryHeader() {
  return (
    <div className="animate-fade-up">
      <p className="font-display text-xs font-semibold tracking-[0.25em] text-teal-400 uppercase">Logbook</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-50">Trip History</h1>
      <p className="mt-2 text-sm text-ink-300">Every trip plan you've generated, with its logs a click away.</p>
    </div>
  );
}
