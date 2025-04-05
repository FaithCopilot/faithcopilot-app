import React from "react";

export const AccountSection = ({
  title,
  layout,
  className,
  children
}: {
  title: string;
  layout: string;
  className: string;
  children: React.ReactNode;
}) => {
  if (!layout) layout = "row";
  return (
    <div
      className={[
        "w-full m-2 p-4 rounded ring-1 ring-neutral-400 dark:ring-neutral-600",
        layout === "row"
          ? "flex flex-row items-center justify-between"
          : "flex flex-col items-start justify-start space-y-4"
      ].join(" ")}
    >
      <div className="text-xl">{title}</div>
      <div
        className={[
          layout === "row" ? "w-1/2 md:w-1/3 " : "w-full",
          className ?? ""
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};
