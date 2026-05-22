import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "mono";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs",
        variant === "default" &&
          "border-(--color-border) bg-(--color-muted) text-(--color-foreground)",
        variant === "mono" &&
          "border-(--color-border) bg-transparent font-mono tracking-(--tracking-mono) text-(--color-muted-foreground)",
        className,
      )}
      {...props}
    />
  );
}
