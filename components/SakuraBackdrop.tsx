/**
 * Soft irregular dotted field behind the assistant chat.
 */
export default function SakuraBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(213,96,137,0.07),transparent_55%)]" />

      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.55]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
              <circle cx="12" cy="18" r="1.2" fill="#D56089" opacity="0.55"/>
              <circle cx="48" cy="10" r="0.8" fill="#D56089" opacity="0.35"/>
              <circle cx="86" cy="22" r="1.5" fill="#E28AA8" opacity="0.45"/>
              <circle cx="128" cy="14" r="1" fill="#D56089" opacity="0.4"/>
              <circle cx="148" cy="36" r="0.7" fill="#E28AA8" opacity="0.3"/>
              <circle cx="28" cy="46" r="1.1" fill="#D56089" opacity="0.5"/>
              <circle cx="68" cy="52" r="0.9" fill="#E28AA8" opacity="0.38"/>
              <circle cx="104" cy="42" r="1.35" fill="#D56089" opacity="0.42"/>
              <circle cx="142" cy="58" r="0.85" fill="#D56089" opacity="0.33"/>
              <circle cx="16" cy="78" r="0.75" fill="#E28AA8" opacity="0.36"/>
              <circle cx="52" cy="88" r="1.4" fill="#D56089" opacity="0.48"/>
              <circle cx="92" cy="74" r="1" fill="#D56089" opacity="0.32"/>
              <circle cx="122" cy="92" r="1.2" fill="#E28AA8" opacity="0.44"/>
              <circle cx="154" cy="80" r="0.7" fill="#D56089" opacity="0.28"/>
              <circle cx="36" cy="118" r="1.15" fill="#D56089" opacity="0.4"/>
              <circle cx="74" cy="126" r="0.85" fill="#E28AA8" opacity="0.34"/>
              <circle cx="110" cy="114" r="1.45" fill="#D56089" opacity="0.46"/>
              <circle cx="138" cy="132" r="0.95" fill="#D56089" opacity="0.37"/>
              <circle cx="8" cy="142" r="1.05" fill="#E28AA8" opacity="0.3"/>
              <circle cx="58" cy="150" r="0.8" fill="#D56089" opacity="0.42"/>
              <circle cx="98" cy="146" r="1.25" fill="#E28AA8" opacity="0.35"/>
              <circle cx="150" cy="152" r="0.75" fill="#D56089" opacity="0.31"/>
              <circle cx="44" cy="68" r="0.65" fill="#D56089" opacity="0.25"/>
              <circle cx="118" cy="28" r="0.7" fill="#E28AA8" opacity="0.27"/>
              <circle cx="80" cy="104" r="0.9" fill="#D56089" opacity="0.29"/>
            </svg>
          `)}")`,
          backgroundSize: "clamp(9rem, 14vw, 12rem) clamp(9rem, 14vw, 12rem)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.32]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
              <circle cx="30" cy="40" r="1.8" fill="#D56089" opacity="0.5"/>
              <circle cx="110" cy="24" r="1.2" fill="#E28AA8" opacity="0.4"/>
              <circle cx="180" cy="56" r="2" fill="#D56089" opacity="0.45"/>
              <circle cx="70" cy="110" r="1.5" fill="#D56089" opacity="0.38"/>
              <circle cx="150" cy="130" r="1.1" fill="#E28AA8" opacity="0.42"/>
              <circle cx="40" cy="180" r="1.7" fill="#D56089" opacity="0.36"/>
              <circle cx="190" cy="170" r="1.3" fill="#E28AA8" opacity="0.34"/>
              <circle cx="120" cy="190" r="2.1" fill="#D56089" opacity="0.4"/>
            </svg>
          `)}")`,
          backgroundSize: "clamp(13rem, 20vw, 17rem) clamp(13rem, 20vw, 17rem)",
          backgroundPosition: "3rem 2rem",
        }}
      />
    </div>
  );
}
