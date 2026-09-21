type BarsIconProps = {
  open?: boolean;
  className?: string;
};

export default function BarsIcon({ open = false, className = "" }: BarsIconProps) {
  return (
    <span
      className={`relative block h-3.5 w-[18px] ${className}`}
      aria-hidden="true"
    >
      <span
        className={`absolute left-0 h-px w-full bg-current transition duration-200 ease-out ${
          open ? "top-[7px] rotate-45" : "top-0.5"
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] h-px w-full bg-current transition duration-200 ease-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 h-px w-full bg-current transition duration-200 ease-out ${
          open ? "top-[7px] -rotate-45" : "top-[13px]"
        }`}
      />
    </span>
  );
}
