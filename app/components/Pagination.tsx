import React from "react";
import { Link } from "react-router-dom";
import IdGenerator from "~/lib/IdGenerator";

// Define the type for the pagination item
interface PaginationItem {
  type: string;
  page: number;
  selected: boolean;
}

// Define the props for the custom pagination component
interface PaginationProps {
  color?: string;
  variant?: string;
  shape?: string;
  page: number;
  count: number;
  asChild?: boolean;
  baseUrl?: string;
  component?: any;
  renderItem: (item: PaginationItem) => React.ReactNode;
}

// Custom Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  color = "standard",
  variant = "text",
  shape = "circular",
  page,
  count,
  asChild = false,
  baseUrl,
  component,
  renderItem,
  ...props
}) => {
  const items: PaginationItem[] = [];

  // Function to generate pagination items with ellipses
  const generatePaginationItems = () => {
    const maxPages = 7; // Maximum number of visible pages

    if (count <= maxPages) {
      // If total pages are less than or equal to the maximum visible pages
      for (let i = 1; i <= count; i++) {
        items.push({
          type: "page",
          page: i,
          selected: i === page,
        });
      }
    } else {
      // If total pages are more than the maximum visible pages
      const start = Math.max(1, page - Math.floor(maxPages / 2));
      const end = Math.min(count, start + maxPages - 1);

      // Add ellipsis before the start page if needed
      if (start > 1) {
        items.push({ type: "start-ellipsis", page: -1, selected: false });
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        items.push({
          type: "page",
          page: i,
          selected: i === page,
        });
      }

      // Add ellipsis after the end page if needed
      if (end < count) {
        items.push({ type: "end-ellipsis", page: -1, selected: false });
      }
    }
  };

  generatePaginationItems();

  // Function to render ellipses, page number, or previous/next button
  const renderEllipsisOrPage = (item: PaginationItem) => {
    if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
      return "...";
    } else {
      return renderItem(item);
    }
  };

  const Comp = component ? component : "a";

  return (
    <nav aria-label="pagination navigation">
      <ul className="flex flex-wrap items-center p-0 m-0 list-none gap-2">
        {/* Previous Button */}
        <Comp
          to={page != 1 ? `${baseUrl}?page=${page - 1}` : `${baseUrl}`}
          className="p-1 rounded-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Comp>

        {/* Pagination Items */}
        {items.map((item) => (
          <li key={IdGenerator()}>{renderEllipsisOrPage(item)}</li>
        ))}

        {/* Next Button */}
        <Comp
          to={
            page != count
              ? `${baseUrl}?page=${page + 1}`
              : `${baseUrl}?page=${page}`
          }
          className="p-1 rounded-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Comp>
      </ul>
    </nav>
  );
};

export default Pagination;
