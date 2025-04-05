import { Button } from "@/components/buttons/Button";
import { toast } from "@/components/Toast";

import { ICON_SIZE, CopyIcon } from "@/components/Icons";

export const CopyButton = ({
  variant,
  value
}: {
  variant?: "primary" | "surface" | "danger" | "outline" | "hover" | "link" | "none";
  value: string;
}) => {
  const onClick = () => {
    navigator.clipboard.writeText(value);
    toast("Copied to clipboard", { className: "toast-brand" });
  };
  return <Button aria-label="Copy" variant={variant} icon={<CopyIcon size={ICON_SIZE} />} onClick={onClick} />;
};
