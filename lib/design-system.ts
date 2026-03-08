export const ds = {
  page: "min-h-screen bg-[#0A0A0A] text-white",
  shell: "max-w-[720px] mx-auto px-6",
  card: "border border-neutral-800 rounded-xl bg-neutral-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
  tile: "aspect-square rounded-xl border border-neutral-800 bg-transparent hover:border-neutral-600 hover:bg-neutral-900/40 transition-all duration-200",
  input: "w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 outline-none transition-all duration-150",
  label: "block text-sm font-medium text-neutral-300 mb-2",
  buttonPrimary: "w-full bg-white text-black py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors duration-150",
  buttonGhost: "w-full py-3 border border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors",
  badgeLive: "text-[11px] uppercase tracking-[0.18em] text-neutral-500",
  footer: "border-t border-neutral-900 py-6 text-center text-xs text-neutral-600",
  modal: "border border-neutral-800 rounded-2xl bg-neutral-950 p-6 shadow-2xl"
} as const;
