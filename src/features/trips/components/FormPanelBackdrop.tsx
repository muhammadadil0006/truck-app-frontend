/** Decorative diagonal hatch + top edge glow behind a form panel. */
export function FormPanelBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, white 0px, white 1px, transparent 1px, transparent 28px)",
        }}
      />
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
    </div>
  );
}
