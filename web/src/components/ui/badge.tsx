import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-maroon-600 text-white shadow-sm",
        secondary: "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
        destructive: "border-transparent bg-rose-600 text-white shadow-sm",
        outline: "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
