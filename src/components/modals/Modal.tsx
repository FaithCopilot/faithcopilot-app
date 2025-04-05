import React, { cloneElement, useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/buttons/Button";
import { ICON_SIZE, XIcon } from "@/components/Icons";

// TODO: i18n support
export const Modal = ({
  fullscreen = false,
  size = 'sm',
  position = 'center',
  title,
  description,
  content,
  cancel = false,
  footer,
  trigger,
  open: controlledOpen,
  onOpenChange,
  state,
  setState,
  closeOnOutsideClick = true,
  className = undefined,
}: {
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'top' | 'bottom';
  title: string;
  description?: string;
  content?: React.ReactNode;
  cancel?: boolean;
  footer?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  state?: any;
  setState?: (state: any) => void;
  closeOnOutsideClick?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const modalRef = useRef<any|null>(null);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, []);

  const handleKeyDown = (evt: any) => {
    if (evt.key === 'Escape') {
      handleClose();
    };
  };

  const handleOutsideClick = (evt: any) => {
    // workaround for Radix components within the modal (ie, ButtonMenu)
    const path = evt.composedPath && evt.composedPath();
    const clickedRadixComponent = path.some((element: any) => 
      element instanceof HTMLElement && element.id.includes("radix-")
    );
    // check if path contains a div (fix for Radix dropdowns)
    const clickedDiv = path.some((element: any) =>
      element instanceof HTMLElement && element.tagName === "DIV"
    );
    if (
      clickedDiv &&
      closeOnOutsideClick &&
      modalRef.current &&
      !modalRef.current.contains(evt.target) &&
      !clickedRadixComponent
    ) {
      handleClose();
    };
  };

  useEffect(() => {
    if (isOpen && closeOnOutsideClick) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, closeOnOutsideClick]);

  if (!isOpen) {
    if (trigger) {
      return cloneElement(trigger as React.ReactElement<any>, { onClick: handleOpen });
    };
    return null;
  };

  const sizeClasses = {
    sm: "md:min-w-[calc(20%)] max-w-[calc(95%)] md:min-h-[calc(20%)] max-h-[calc(95%)]",
    md: "md:min-w-[calc(40%)] max-w-[calc(95%)] md:min-h-[calc(40%)] max-h-[calc(95%)]",
    lg: "md:min-w-[calc(80%)] max-w-[calc(95%)] md:min-h-[calc(80%)] max-h-[calc(95%)]",
    full: "w-full h-full",
  };

  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center",
    bottom: "items-end justify-center",
  };

  const modalSizeClass = fullscreen ? "w-screen h-screen" : sizeClasses[size];
  const modalPositionClass = fullscreen ? '' : positionClasses[position];

  const ContentHOC = content ? cloneElement(content as React.ReactElement<any>, { state, setState }) : null;

  return (
    <div id={`modal-${title}`}>
      {trigger && cloneElement(trigger as React.ReactElement<any>, { onClick: handleOpen })}
      <div className={`fixed inset-0 z-50 flex overflow-x-hidden overflow-y-auto outline-none focus:outline-none ${modalPositionClass}`}>
        <div className="fixed inset-0 bg-black opacity-80"></div>
        <div className={`relative mx-auto ${modalSizeClass} ${className}`} ref={modalRef}>
          <div className={`relative p-4 flex flex-col surfaces dark:bg-neutral-950 borders rounded-lg shadow-lg outline-none focus:outline-none ${fullscreen ? 'h-full' : ''}`}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Button
                variant="none"
                icon={<XIcon size={ICON_SIZE} />}
                onClick={handleClose}
              />
            </div>
            <div className={`relative flex-auto overflow-y-auto ${fullscreen ? "flex-grow" : ''}`}>
              {description && <div className="placeholders">{description}</div>}
              <div className="py-2">
                {ContentHOC}
              </div>
            </div>
            <div className="flex items-center justify-end">
              { cancel && (
                <Button
                  variant="link"
                  type="button"
                  label="Cancel"
                  // TODO: disable focus ring
                  //className="focus:ring-0 focus:outline-none focus:border-0"
                  onClick={handleClose}
                />
              )}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
