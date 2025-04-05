import { useEffect, useState } from "react";

import { Button } from "../buttons/Button";

const indexToLetter = (index: number): string | null => {
  if (index < 1 || index > 26) return null;
  return String.fromCharCode(64 + index);
};

// TODO: move to utils (shared with ChatMessages.tsx)
const getColorsByIndex = (idx: number): string => {
  const light = [
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200"
  ];
  const dark = [
    "dark:bg-yellow-600",
    "dark:bg-green-600",
    "dark:bg-blue-600",
    "dark:bg-indigo-600",
    "dark:bg-purple-600",
    "dark:bg-pink-600"
  ];
  return light[idx] + " " + dark[idx];
};

export const FeedbackButtons = ({
  length,
  onFeedback,
  inputChangeEvent,
  submitEvent,
  className
}: {
  length: number;
  onFeedback: (idx: number) => void;
  inputChangeEvent?: any;
  submitEvent?: any;
  className?: string;
}) => {
  /*
  const [displayFeedbackButtons, setDisplayFeedbackButtons] =
    useState<boolean>(false);

  useEffect(() => {
    if (displayFeedbackButtons === false) {
      setDisplayFeedbackButtons(true);
    }
  }, [submitEvent]);
  */

  const handleFeedback = (idx: number) => {
    //setDisplayFeedbackButtons(false);
    if (onFeedback) onFeedback(idx);
    return;
  };

  //if (displayFeedbackButtons !== true) return null;
  return (
    <div className="flex flex-row space-x-1 md:space-x-2 items-center justify-center w-full overflow-x-auto py-1 md:py-2">
      {Array.from({ length }).map((_, idx: number) => {
        const key = indexToLetter(idx + 1);
        const secondaryColors = getColorsByIndex(idx);
        return (
          <Button
            key={key}
            //variant="primary"
            type="button"
            className="h-10 md:h-12 min-w-24 justify-center p-0 md:w-full"
            onClick={() => handleFeedback(idx)}
          >
            <div className="flex flex-row space-x-1 md:space-x-2 items-center">
              <div
                className={[
                  "h-4 w-4",
                  idx % 2 === 0
                    ? "border-2 border-white bg-primary-200 dark:bg-primary-700"
                    : `border-2 border-white ${secondaryColors}`
                ].join(" ")}
              ></div>
              <span className="font-bold">👍 {key}</span>
            </div>
          </Button>
        );
      })}
      <Button
        key="tie"
        //variant="primary"
        type="button"
        className="h-10 md:h-12 min-w-24 justify-center p-0 md:w-full"
        onClick={() => handleFeedback(-2)}
      >
        <span className="font-bold">🤝 Tie</span>
      </Button>
      <Button
        key="none"
        //variant="primary"
        type="button"
        className="h-10 md:h-12 min-w-28 justify-center p-0 md:w-full"
        onClick={() => handleFeedback(-1)}
      >
        <span className="font-bold">👎 None</span>
      </Button>
    </div>
  );
};
