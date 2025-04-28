import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navLinkVariants = cva("font-body inline-block text-xs font-semibold", {
  variants: {
    textColor: {
      primary: "text-primary-600",
      secondary: "text-body-bold",
      white: "text-white",
    },
    afterColor: {
      primary: "after:bg-primary-600",
      secondary: "after:bg-body-bold",
      white: "after:bg-white",
    },
    padding: {
      default: "py-2 px-4",
      none: "p-0",
    },
    hover: {
      line: "hover:underline",
      "animate-center":
        "relative after:contents[''] after:scale-x-0 after:block  after:h-0.25 after:absolute after:inset-x-0 after:mt-1 after:transition after:origin-bottom after:duration-300 hover:after:scale-x-80 hover:after:transition hover:after:duration-300 my-1",
      "animate-left":
        "relative after:contents[''] after:scale-x-0 after:block after:h-0.25 after:absolute after:inset-x-0 after:mt-1 after:transition after:origin-center after:duration-300 hover:after:scale-x-80 hover:after:transition hover:after:duration-300 my-1",
    },
  },
  defaultVariants: {
    textColor: "primary",
    padding: "default",
    hover: "line",
  },
});

interface NavLinkProps
  extends VariantProps<typeof navLinkVariants>,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  textColor,
  padding,
  hover,
  href,
  afterColor,
  ...props
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group",
        navLinkVariants({ textColor, afterColor, padding, hover })
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default NavLink;
