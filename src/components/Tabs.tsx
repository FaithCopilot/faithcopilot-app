import { useState } from "react";

export const Tabs = ({ items, className }: { items: any, className: string }) => {
  if (!items?.[0]?.label) return null;
  const defaultTab = items[0].label.toLowerCase();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const handleTabClick = (tabLabel: string) => setActiveTab(tabLabel);
  return (
    <div className={["w-full", className ?? ''].join(' ')}>
      {/* Tab headers */}
      <div className="min-w-48 p-1 flex space-x-1 surfaces rounded-lg items-center ring-1 rings">
        {items.map(({ label }: { label: string }) => {
          const tab = label.toLowerCase();
          return (
            <div
              key={`${tab}-key`}
              className={[
                "flex w-1/2 p-2 justify-center font-semibold rounded-lg cursor-pointer transition-colors duration-150",
                activeTab === tab
                  ? "bg-primary-800 text-neutral-50"
                  : " hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-50"
              ].join(" ")}
              onClick={() => handleTabClick(tab)}
            >
              {label}
            </div>
          );
        })}
      </div>
      {/* Tab content */}
      {items.map(
        ({ label, content }: { label: string; content: React.ReactNode }) => {
          const tab = label.toLowerCase();
          if (activeTab !== tab) return null;
          return <div key={`${tab}-content`} className="pt-4">{content}</div>;
        }
      )}
    </div>
  );
};
