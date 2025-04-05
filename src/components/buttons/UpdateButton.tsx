import { Button } from "@/components/buttons/Button";

import {
  ICON_SIZE,
  CheckIcon
} from "@/components/Icons";

export const UpdateButton = ({
  disabled,
  type,
  onClick
}: {
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}) => (
  <Button
    disabled={disabled ?? false}
    type={type ?? "submit"}
    onClick={onClick}
    label="Update"
    iconEnd={<CheckIcon size={ICON_SIZE} />}
    className="w-32 ms-auto"
  />
);
