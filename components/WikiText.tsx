import { parseHeadingLine } from "@/lib/wiki";

type WikiTextProps = {
  text: string;
  sectionId: string;
  isPlaceholder?: boolean;
};

const TOKEN_PATTERN =
  /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;

const LINK_CLASS =
  "text-terracotta underline decoration-terracotta/35 decoration-[1px] underline-offset-[0.22em] transition hover:text-terracotta-light hover:decoration-terracotta";

function LinkedText({ text }: { text: string }) {
  const parts = text.split(TOKEN_PATTERN);

  return parts.map((part, index) => {
    const markdownLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (markdownLink) {
      const [, label, href] = markdownLink;
      const isInternal = href.startsWith("#");

      return (
        <a
          key={`${href}-${index}`}
          href={href}
          {...(isInternal
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
          className={LINK_CLASS}
        >
          {label}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return null;
    }

    return <span key={index}>{part}</span>;
  });
}

function Block({
  block,
  sectionId,
}: {
  block: string;
  sectionId: string;
}) {
  if (block.startsWith("### ")) {
    const heading = parseHeadingLine(block.slice(4), sectionId);

    return (
      <h3
        id={heading.id}
        className="mt-6 scroll-mt-[calc(var(--header-height)+0.85rem)] font-heading text-[1.15rem] font-normal tracking-tight text-sand"
      >
        {heading.title}
      </h3>
    );
  }

  const lines = block.split("\n").filter((line) => line.trim().length > 0);
  const isList =
    lines.length > 0 && lines.every((line) => line.startsWith("- "));

  if (isList) {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[1.02rem] leading-[1.65] text-sand/78">
        {lines.map((line) => (
          <li key={line}>
            <LinkedText text={line.slice(2)} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-3 text-[1.02rem] leading-[1.65] text-sand/78">
      <LinkedText text={block} />
    </p>
  );
}

export default function WikiText({
  text,
  sectionId,
  isPlaceholder = false,
}: WikiTextProps) {
  if (isPlaceholder) {
    return (
      <p className="mt-3 text-[1.02rem] leading-[1.65] italic text-sand/40">
        {text}
      </p>
    );
  }

  return text
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => (
      <Block
        key={`${sectionId}-${index}-${block.slice(0, 40)}`}
        block={block}
        sectionId={sectionId}
      />
    ));
}
