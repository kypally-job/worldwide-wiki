import type { ReactNode } from "react";

type MotifLayer = "hero" | "page";

type MotifItem = {
  node: ReactNode;
  className: string;
  drift?: boolean;
  fall?: boolean;
};

const motifClass =
  "pointer-events-none absolute text-terracotta";

function Khinkali({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M32 6c2.2 4.6 2.8 7.4 1.6 10.2 8.6 1.4 16.4 8.2 16.4 18.6 0 10.2-8 19.2-18 19.2S14 45 14 34.8c0-10.4 7.8-17.2 16.4-18.6C29.2 13.4 29.8 10.6 32 6Z" />
      <path
        d="M32 18.4c-7.6.8-13.6 6.6-13.6 16.4 0 8.6 6.4 15.4 13.6 15.4s13.6-6.8 13.6-15.4c0-9.8-6-15.6-13.6-16.4Z"
        className="opacity-70"
      />
      <circle cx="32" cy="8.5" r="2.2" />
    </svg>
  );
}

function Grape({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M24 4c6 8 7 14 4 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="18" cy="28" r="6" />
      <circle cx="30" cy="28" r="6" />
      <circle cx="24" cy="38" r="6" />
      <circle cx="16" cy="40" r="5.2" />
      <circle cx="32" cy="40" r="5.2" />
      <circle cx="24" cy="50" r="5.4" />
    </svg>
  );
}

function Vine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M24 4c12 18 12 28 0 44s-12 26 0 44 12 28 0 64" />
      <path d="M24 30c-14-4-20 8-14 18M24 74c14-4 20 8 14 18M24 118c-14-4-20 8-14 18" />
      <ellipse cx="12" cy="44" rx="7" ry="10" fill="currentColor" stroke="none" />
      <ellipse cx="38" cy="88" rx="7" ry="10" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="132" rx="7" ry="10" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Church({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 88"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M36 2 46 28H26Z" />
      <rect x="24" y="28" width="24" height="44" />
      <path d="M12 44 22 56H2Z" />
      <path d="M60 44 70 56H50Z" />
      <rect x="2" y="56" width="20" height="24" />
      <rect x="50" y="56" width="20" height="24" />
      <rect x="32" y="48" width="8" height="24" className="opacity-40" />
    </svg>
  );
}

function Mountains({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 60 52 12l28 28 32-40 40 60H8Z" className="opacity-55" />
      <path d="M28 60 78 18l42 42H28Z" />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2c6 7 8 14 0 28C4 16 6 9 12 2Z" />
    </svg>
  );
}

function Azulejo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="56" height="56" />
      <path d="M32 4 60 32 32 60 4 32Z" />
      <circle cx="32" cy="32" r="8" />
    </svg>
  );
}

function Wave({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M2 16c10-12 18-12 28 0s18 12 28 0 18-12 28 0 18 12 28 0" />
    </svg>
  );
}

function Lotus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M32 44c-8-10-18-16-26-18 8-2 16 0 26 8 10-8 18-10 26-8-8 2-18 8-26 18Z" />
      <path d="M32 40c-4-14-2-24 0-32 2 8 4 18 0 32Z" className="opacity-80" />
      <path d="M18 36c2-12 8-18 14-22-2 8-4 16-14 22Z" className="opacity-70" />
      <path d="M46 36c-2-12-8-18-14-22 2 8 4 16 14 22Z" className="opacity-70" />
    </svg>
  );
}

function Chedi({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 84"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 2 27 18h-6Z" />
      <ellipse cx="24" cy="22" rx="7" ry="4" />
      <path d="M16 28h16l-3 10H19Z" />
      <path d="M10 40h28l-5 12H15Z" />
      <rect x="8" y="52" width="32" height="6" />
      <rect x="12" y="58" width="24" height="22" />
    </svg>
  );
}

function Fan({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 40"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M32 38 6 10c8-6 18-8 26-8s18 2 26 8L32 38Z" />
      <path
        d="M32 38 18 12M32 38 32 8M32 38 46 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="opacity-40"
      />
    </svg>
  );
}

function Lantern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 58"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="18" y="2" width="4" height="8" />
      <ellipse cx="20" cy="16" rx="14" ry="6" />
      <path d="M6 16q0 26 14 34 14-8 14-34" className="opacity-85" />
      <path
        d="M10 24h20M8 32h24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="opacity-35"
      />
    </svg>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="10" />
      <path d="M32 4v10M32 50v10M4 32h10M50 32h10M12 12l7 7M45 45l7 7M12 52l7-7M45 19l7-7" />
    </svg>
  );
}

function Mate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="22" cy="18" rx="14" ry="8" />
      <path d="M10 18c0 16 4 30 12 30s12-14 12-30" />
      <path
        d="M28 16c10-8 18-6 20 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

const motifs: Record<string, Record<MotifLayer, MotifItem[]>> = {
  georgia: {
    hero: [
      {
        node: <Khinkali />,
        className: "top-[8%] right-[4%] h-32 w-32 opacity-[0.42] md:h-44 md:w-44",
        drift: true,
      },
      {
        node: <Grape />,
        className: "top-[36%] right-[16%] h-24 w-16 opacity-[0.36] md:h-32 md:w-24",
      },
      {
        node: <Vine />,
        className: "top-[6%] left-[2%] h-48 w-14 opacity-[0.28] md:h-64 md:w-16",
      },
      {
        node: <Church />,
        className: "bottom-[10%] right-[8%] h-20 w-16 opacity-[0.32] md:h-28 md:w-24",
      },
      {
        node: <Mountains />,
        className: "bottom-[-4%] left-[18%] h-16 w-40 opacity-[0.26] md:h-24 md:w-64",
      },
    ],
    page: [
      {
        node: <Vine />,
        className: "top-[4%] left-[1%] hidden h-[28rem] w-16 opacity-[0.2] lg:block",
      },
      {
        node: <Khinkali />,
        className: "top-[8%] right-[3%] h-24 w-24 opacity-[0.22] md:h-32 md:w-32",
        drift: true,
      },
      {
        node: <Church />,
        className: "top-[22%] left-[4%] hidden h-28 w-24 opacity-[0.18] md:block",
      },
      {
        node: <Grape />,
        className: "top-[38%] right-[5%] h-24 w-16 opacity-[0.2]",
      },
      {
        node: <Mountains />,
        className: "top-[52%] left-[2%] hidden h-20 w-52 opacity-[0.16] lg:block",
      },
      {
        node: <Khinkali />,
        className: "top-[68%] right-[8%] h-16 w-16 opacity-[0.18] md:h-24 md:w-24",
        drift: true,
      },
      {
        node: <Vine />,
        className: "top-[74%] right-[2%] hidden h-64 w-14 opacity-[0.16] lg:block",
      },
      {
        node: <Grape />,
        className: "top-[88%] left-[6%] h-20 w-16 opacity-[0.16]",
      },
    ],
  },
  portugal: {
    hero: [
      {
        node: <Azulejo />,
        className: "top-[10%] right-[4%] h-32 w-32 opacity-[0.4] md:h-44 md:w-44",
      },
      {
        node: <Azulejo />,
        className: "top-[28%] right-[18%] h-16 w-16 rotate-12 opacity-[0.28]",
      },
      {
        node: <Wave />,
        className: "top-[46%] right-[8%] h-12 w-48 opacity-[0.38]",
        drift: true,
      },
      {
        node: <Azulejo />,
        className: "bottom-[12%] left-[4%] h-20 w-20 -rotate-6 opacity-[0.3]",
      },
      {
        node: <Wave />,
        className: "bottom-[6%] left-[22%] h-10 w-40 opacity-[0.22]",
      },
    ],
    page: [
      {
        node: <Azulejo />,
        className: "top-[6%] right-[3%] h-28 w-28 opacity-[0.2]",
      },
      {
        node: <Wave />,
        className: "top-[18%] left-[2%] hidden h-10 w-44 opacity-[0.18] md:block",
      },
      {
        node: <Azulejo />,
        className: "top-[34%] left-[4%] h-16 w-16 rotate-12 opacity-[0.16]",
      },
      {
        node: <Azulejo />,
        className: "top-[48%] right-[6%] h-20 w-20 -rotate-6 opacity-[0.18]",
      },
      {
        node: <Wave />,
        className: "top-[66%] right-[4%] h-10 w-40 opacity-[0.16]",
        drift: true,
      },
      {
        node: <Azulejo />,
        className: "top-[82%] left-[5%] h-24 w-24 opacity-[0.16]",
      },
    ],
  },
  "south-korea": {
    hero: [
      {
        node: <Fan />,
        className: "top-[8%] right-[4%] h-28 w-44 opacity-[0.4] md:h-36 md:w-56",
      },
      {
        node: <Lantern />,
        className: "bottom-[12%] left-[5%] h-24 w-16 opacity-[0.34] md:h-32 md:w-20",
      },
      {
        node: <Petal />,
        className: "top-[22%] right-[24%] h-12 w-9 opacity-[0.5]",
        fall: true,
      },
      {
        node: <Petal />,
        className: "top-[6%] right-[38%] h-9 w-7 opacity-[0.42]",
        fall: true,
      },
      {
        node: <Petal />,
        className: "top-[14%] left-[18%] h-10 w-8 opacity-[0.38]",
        fall: true,
      },
      {
        node: <Fan />,
        className: "bottom-[8%] right-[14%] h-16 w-24 rotate-[-16deg] opacity-[0.26]",
      },
    ],
    page: [
      {
        node: <Fan />,
        className: "top-[6%] right-[3%] h-24 w-36 opacity-[0.2]",
      },
      {
        node: <Lantern />,
        className: "top-[20%] left-[4%] hidden h-28 w-20 opacity-[0.18] md:block",
      },
      {
        node: <Petal />,
        className: "top-[12%] right-[22%] h-10 w-8 opacity-[0.28]",
        fall: true,
      },
      {
        node: <Petal />,
        className: "top-[40%] left-[8%] h-9 w-7 opacity-[0.22]",
        fall: true,
      },
      {
        node: <Fan />,
        className: "top-[58%] right-[5%] h-20 w-32 rotate-[-12deg] opacity-[0.16]",
      },
      {
        node: <Lantern />,
        className: "top-[76%] right-[8%] h-20 w-14 opacity-[0.16]",
      },
      {
        node: <Petal />,
        className: "top-[88%] left-[10%] h-10 w-8 opacity-[0.2]",
        fall: true,
      },
    ],
  },
  thailand: {
    hero: [
      {
        node: <Lotus />,
        className: "top-[8%] right-[4%] h-28 w-40 opacity-[0.42] md:h-40 md:w-52",
      },
      {
        node: <Chedi />,
        className: "bottom-[8%] left-[4%] h-32 w-16 opacity-[0.34] md:h-44 md:w-24",
      },
      {
        node: <Lotus />,
        className: "bottom-[14%] right-[16%] h-16 w-20 rotate-[-10deg] opacity-[0.26]",
      },
      {
        node: <Petal />,
        className: "top-[20%] right-[26%] h-11 w-9 opacity-[0.46]",
        fall: true,
      },
      {
        node: <Petal />,
        className: "top-[8%] right-[42%] h-8 w-6 opacity-[0.38]",
        fall: true,
      },
    ],
    page: [
      {
        node: <Chedi />,
        className: "top-[6%] left-[3%] hidden h-36 w-20 opacity-[0.18] md:block",
      },
      {
        node: <Lotus />,
        className: "top-[10%] right-[4%] h-24 w-32 opacity-[0.2]",
      },
      {
        node: <Petal />,
        className: "top-[28%] right-[16%] h-10 w-8 opacity-[0.24]",
        fall: true,
      },
      {
        node: <Lotus />,
        className: "top-[46%] left-[5%] h-20 w-28 rotate-[-8deg] opacity-[0.16]",
      },
      {
        node: <Chedi />,
        className: "top-[64%] right-[5%] h-28 w-16 opacity-[0.16]",
      },
      {
        node: <Lotus />,
        className: "top-[84%] right-[8%] h-16 w-20 opacity-[0.16]",
      },
    ],
  },
  argentina: {
    hero: [
      {
        node: <Sun />,
        className: "top-[8%] right-[4%] h-32 w-32 opacity-[0.42] md:h-44 md:w-44",
      },
      {
        node: <Mate />,
        className: "bottom-[10%] left-[5%] h-24 w-20 opacity-[0.36] md:h-32 md:w-28",
      },
      {
        node: <Mountains />,
        className: "bottom-[-2%] right-[12%] h-16 w-44 opacity-[0.26] md:h-20 md:w-60",
      },
      {
        node: <Sun />,
        className: "top-[46%] right-[18%] h-14 w-14 opacity-[0.2]",
      },
    ],
    page: [
      {
        node: <Sun />,
        className: "top-[6%] right-[4%] h-28 w-28 opacity-[0.2]",
      },
      {
        node: <Mate />,
        className: "top-[24%] left-[4%] hidden h-24 w-20 opacity-[0.18] md:block",
      },
      {
        node: <Mountains />,
        className: "top-[42%] left-[2%] hidden h-16 w-48 opacity-[0.16] lg:block",
      },
      {
        node: <Sun />,
        className: "top-[60%] right-[6%] h-16 w-16 opacity-[0.16]",
      },
      {
        node: <Mate />,
        className: "top-[78%] right-[8%] h-20 w-16 opacity-[0.16]",
      },
      {
        node: <Mountains />,
        className: "top-[90%] left-[6%] h-14 w-40 opacity-[0.14]",
      },
    ],
  },
};

export default function CountryMotif({
  slug,
  layer = "hero",
}: {
  slug: string;
  layer?: MotifLayer;
}) {
  const items = motifs[slug]?.[layer];

  if (!items) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <div
          key={`${layer}-${index}`}
          className={`${motifClass} ${item.className} ${
            item.drift ? "motif-drift" : ""
          } ${item.fall ? "motif-fall" : ""}`}
          style={
            item.fall
              ? { animationDelay: `${index * 1.6}s` }
              : item.drift
                ? { animationDelay: `${index * 0.7}s` }
                : undefined
          }
        >
          {item.node}
        </div>
      ))}
    </div>
  );
}
