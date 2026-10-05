const paths = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 wallet:'<path d="M20 8H5a2 2 0 0 1 0-4h13v4M4 6v13a2 2 0 0 0 2 2h14V8M20 12h-6v5h6"/><path d="M17 14.5h.01"/>',
 arrows:'<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
 up:'<path d="m5 15 7-7 7 7M12 8v13"/>', down:'<path d="m5 9 7 7 7-7M12 16V3"/>',
 card:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
 shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
 plane:'<path d="m21 3-6 18-4-8-8-4 18-6ZM11 13l10-10"/>',
 chart:'<path d="M4 3v17h17M8 15l5-6 4 3 4-7"/>',
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>', menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 7a8 8 0 0 1 14-1l1 6M4 12l1 6a8 8 0 0 0 14-1"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>', search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
 moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>'
};
export const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.wallet}</svg>`;
