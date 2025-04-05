export const Menu = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={className ?? ""}>
    <div className="px-3 py-4 rounded surfaces ring-1 ring-inset rings">
      <ul className="space-y-2">{children}</ul>
    </div>
  </div>
);
