import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type GlassCardProps = {
  title: string;
  description: string;
  /** Ikon SVG Lucide (opsional) */
  icon?: LucideIcon;
  /** Warna aksen tile ikon */
  tone?: "primary" | "accent";
  /** Jika diisi, seluruh kartu menjadi link interaktif */
  href?: string;
  className?: string;
  children?: ReactNode;
};

const toneClass = {
  primary: "bg-primary-soft text-primary ring-primary/15",
  accent: "bg-accent-soft text-accent-strong ring-accent/20",
};

export function GlassCard({
  title,
  description,
  icon: Icon,
  tone = "primary",
  href,
  className = "",
  children,
}: GlassCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        {Icon ? (
          <span
            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ${toneClass[tone]}`}
          >
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null}
        {href ? (
          <ArrowUpRight
            aria-hidden
            className="size-5 text-muted-foreground transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>
      {children ? <div className="mt-auto pt-5">{children}</div> : null}
    </>
  );

  const base = `glass group flex flex-col rounded-2xl p-6 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 active:translate-y-0 motion-reduce:transform-none motion-reduce:hover:translate-y-0`}
      >
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}
