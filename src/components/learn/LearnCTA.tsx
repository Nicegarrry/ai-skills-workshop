/**
 * LearnCTA — Section 6 / sticky footer CTA on the Learn page.
 *
 * "Now build one." → /build. Used both inline (end of content) and as a
 * sticky bottom bar on larger screens via the Learn page layout.
 */
import Link from "next/link";
import { buttonClasses } from "@/components/ui";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

type Props = {
  /** When true, renders as a sticky bottom bar instead of an inline block. */
  sticky?: boolean;
};

export function LearnCTA({ sticky = false }: Props) {
  if (sticky) {
    return (
      <div
        className={
          "fixed bottom-0 left-0 right-0 z-20 hidden border-t border-line " +
          "bg-surface/90 px-4 py-3 backdrop-blur-sm lg:block"
        }
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <p className="text-sm font-medium text-fg">
            Ready to build?{" "}
            <span className="text-muted">It takes about 10 minutes.</span>
          </p>
          <Link href="/build" className={buttonClasses("primary", "md")}>
            Build the skill
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Next step"
      className="rounded-card border border-accent-200 bg-accent-50 p-6 text-center"
    >
      <h2 className="text-xl font-semibold text-accent-900">
        Now build one.
      </h2>
      <p className="mt-1 text-sm text-accent-800">
        You know what a skill is and why it matters. The lab takes about 10
        minutes — you’ll walk away with a real{" "}
        <code className="rounded bg-accent-100 px-1 py-0.5 font-mono text-xs">
          SKILL.md
        </code>{" "}
        you can download and drop into OneDrive today.
      </p>
      <div className="mt-5">
        <Link href="/build" className={buttonClasses("primary", "lg")}>
          Build the skill
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
