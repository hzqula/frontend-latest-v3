import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 focus:ring-2 text-white shadow hover:bg-primary-700 focus:ring-primary-700 disabled:bg-primary-400 focus:ring-offset-2 disabled:ring-offset-2 disabled:ring-primary-400",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 focus:ring-offset-2 focus:ring-2",
        secondary:
          "bg-gray-100 text-body-bold shadow-sm hover:bg-gray-200 focus:ring-gray-300 disabled:bg-gray-50",
        outline:
          "bg-transparent border-2 border-primary-600 text-primary-600 hover:text-primary-500 hover:border-primary-500 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300",
        "outline-white":
          "bg-transparent border-2 border-white text-white hover:bg-primary-700 focus:ring-primary-500",
        ghost:
          "bg-transparent text-primary-600 hover:bg-primary-100 focus:ring-primary-500",
        link: "text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-1 text-xs",
        lg: "h-12 rounded-md px-6 py-3 text-lg",
        icon: "h-10 w-10 p-2",
        "left-icon": "h-10 pl-2 pr-4 py-2",
        "right-icon": "h-10 pl-4 pr-2 py-2",
        link: "p-0",
      },
      fontStyle: {
        normal: "font-body",
        display: "font-display font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fontStyle: "display",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fontStyle, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fontStyle }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
