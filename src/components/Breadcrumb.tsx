import { ChevronRight } from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  path: string;
}

const formatLabel = (pathSegment: string): string => {
  return pathSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs: BreadcrumbItem[] = [{ label: "", path: "/" }];

    let currentPath = "";
    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;
      crumbs.push({
        label: formatLabel(segment),
        path: currentPath,
      });
    });

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 text-sm"
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={crumb.path}>
            {isLast ? (
              <span className="text-body-bold">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-primary-600 font-semibold">
                {crumb.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="text-gray-500 w-4" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
