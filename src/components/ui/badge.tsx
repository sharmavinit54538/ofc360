import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary border-primary/20",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
        outline: "border-border text-foreground bg-background/50",
        success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
        info: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
