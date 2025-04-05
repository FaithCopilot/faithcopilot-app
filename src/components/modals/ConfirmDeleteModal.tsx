import { useEffect, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { Modal } from "@/components/modals/Modal";

import { ICON_SIZE, DeleteIcon, WarningIcon } from "@/components/Icons";

// TODO: i18n support
export const ConfirmDeleteModal = ({
  title,
  warning,
  data,
  trigger,
  onSuccess, // TODO: rename to onConfirm
  onError, // TODO: is this needed?
  open,
  onOpenChange
}: {
  title: string;
  warning?: string;
  data: any;
  trigger?: React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [_open, _setOpen] = useState<boolean>(open ?? false);
  const [input, setInput] = useState<string | undefined>();
  const [isValid, setIsValid] = useState<boolean | undefined>();

  const confirmValue = data?.confirmValue;

  useEffect(() => {
    if (open !== undefined) {
      _setOpen(open);
    }
    return;
  }, [open]);

  useEffect(() => {
    if (input) {
      setIsValid(input === confirmValue);
    }
    return;
  }, [input]);

  const onSubmit = () => {
    if (isValid && input && input?.length > 0) {
      setInput("");
      setIsValid(undefined);
      onSuccess?.(data);
      if (onOpenChange) {
        onOpenChange(false);
        return;
      }
      _setOpen(false);
    }
    return;
  };

  const _onOpenChange = (__open: boolean) => {
    if (!__open) {
      setInput("");
      setIsValid(undefined);
    }
    if (onOpenChange) {
      onOpenChange(__open);
      return;
    }
    _setOpen(__open);
    return;
  };

  if (!data) return null;

  if (!confirmValue) {
    onError?.(new Error("Confirm Value not provided"));
    return null;
  }

  return (
    <Modal
      size="md"
      title={title}
      content={
        <div>
          {warning && (
            <div className="flex flex-row space-x-2 items-center">
              <WarningIcon color="orange" size={ICON_SIZE} />
              <span className="texts italic">This action cannot be undone!</span>
            </div>
          )}
          <div className="mt-4 flex flex-col space-y-4">
            <span className="text-sm">
              Confirm by typing: <span className="font-bold">{confirmValue}</span>
            </span>
            <input
              // TODO: autocomplete="off"
              //autocomplete={`confirm-delete-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
              type="text"
              value={input}
              onChange={(evt) => setInput(evt.target.value)}
              className="w-full rounded p-1 text-sm texts surfaces ring-1 rings"
            />
            {isValid === false ? (
              <p className="text-sm font-bold text-red-500">
                Value does not match
              </p>
            ) : (
              <p className="text-sm font-bold text-transparent">
                Value does not match
              </p>
            )}
          </div>
        </div>
      }
      cancel
      footer={
        <Button
          variant="danger"
          type="button"
          icon={<DeleteIcon size={ICON_SIZE} />}
          label={title}
          onClick={onSubmit}
        />
      }
      trigger={trigger}
      open={_open}
      onOpenChange={_onOpenChange}
    />
  );
};
