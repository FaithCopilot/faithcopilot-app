import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { ButtonMenu } from "@/components/ButtonMenu";

// TODO: refactor to Icons
import {
  SendHorizontalIcon as SendIcon,
  EllipsisIcon as ActionsIcon,
} from "lucide-react";

//export const MultilineInput = memo(({
export const MultilineInput = ({
  id,
  clearOnClick = true,
  defaultValue,
  resize = false,
  spellcheck = false,
  placeholder = "",
  register,
  //setInputChangeEvent,
  //setSubmitEvent,
  value,
  actions,
  onChange,
  onSubmit,
  onStop,
  onClick
}: {
  id?: string;
  clearOnClick?: boolean;
  defaultValue?: string | undefined;
  resize?: boolean;
  spellcheck?: boolean;
  placeholder?: string;
  register?: any;
  //setInputChangeEvent?: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void
  //setSubmitEvent?: (evt: React.FormEvent<HTMLFormElement>) => void
  value?: string;
  actions?: any[];
  onChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
  onStop?: (evt: React.KeyboardEvent) => void;
  onClick?: (value: string | undefined) => void;
}): React.ReactNode | null => {
  const formRef = useRef<HTMLFormElement>(null);
  const [_value, _setValue] = useState<string>(defaultValue ?? "");

  useEffect(() => {
    if (value) {
      _setValue(value ?? "");
    };
    return;
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.ctrlKey && evt.key === "Enter") {
        if (onSubmit) {
          // programmatically trigger form submission
          formRef?.current?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
          return;
        }
        if (onClick && _value?.length && _value.length > 0) {
          if (clearOnClick) {
            _setValue("");
          };
          onClick(_value);
        }
      }
      return;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [_value]);

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    _setValue(evt.target.value);
    onChange?.(evt);
  }, [onChange]);

  const handleSubmit = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit?.(evt);
  }, [onSubmit]);

  // no "useCallback" bc every key press is a legit re-render
  const handleClick = () => {
    if (clearOnClick) {
      _setValue("");
    };
    onClick?.(_value);
  };

  return (
    <form
      ref={formRef}
      id={`form-${id}`}
      className="w-full flex flex-row rounded ring-1 rings surfaces"
      onSubmit={handleSubmit}
    >
      <textarea
        id={`textarea-${id}`}
        {...register?.(id)}
        value={_value}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck={spellcheck}
        className={[
          "w-full p-2 surfaces border-0 focus:ring-0 texts",
          resize === true ? "resize-y max-h-96" : "resize-none h-16 md:h-24 scroll-y"
        ].join(" ")}
      />
      <div className="flex flex-row space-x-1 md:flex-col md:space-y-2">
        <div className="has-tooltip">
          <Button
            variant="none"
            type={onSubmit ? "submit" : "button"}
            onClick={handleClick}
            icon={(<SendIcon size={24} />)}
            //className="rounded-full bg-primary-400 dark:bg-primary-600 hover:bg-primary-500 dark:hover:bg-primary-700"
          />
          <div className="hidden md:block tooltip -mt-20 -ms-4">Submit</div>
        </div>
        { actions && actions.length > 0 && (
          <div className="has-tooltip">
            <ButtonMenu
              variant="none"
              items={actions}
              icon={<ActionsIcon size={24} />}
            />
            <div className="hidden md:block tooltip -mt-20 -ms-4">Actions</div>
          </div>
        )}
      </div>
    </form>
  );
/*
}, (prevProps, nextProps) => {
  return(
    prevProps.id === nextProps.id &&
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.resize === nextProps.resize &&
    prevProps.spellcheck === nextProps.spellcheck &&
    prevProps.placeholder === nextProps.placeholder &&
    //prevProps.register === nextProps.register &&
    prevProps.value === nextProps.value &&
    prevProps.actions === nextProps.actions
    //prevProps.onChange === nextProps.onChange &&
    //prevProps.onSubmit === nextProps.onSubmit &&
    //prevProps.onStop === nextProps.onStop &&
    //prevProps.onClick === nextProps.onClick
  );
});
*/
};
