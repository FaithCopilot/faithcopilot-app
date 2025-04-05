import React, { useState } from "react";

type StepItemType = {
  id: string;
  component: React.ReactNode;
  props: any;
};

export const Stepper = ({
  currentStep,
  steps,
  stepperOpen,
  setStepperOpen
}: {
  currentStep?: number;
  steps: Array<StepItemType>;
  stepperOpen?: boolean;
  setStepperOpen?: (open: boolean) => void;
}) => {
  const [_currentStep, _setCurrentStep] = useState<number>(currentStep ?? 0);
  const [stepData, setStepData] = useState<any>({});

  const nextStep = (data = {}) => {
    if (_currentStep < steps.length - 1) {
      setStepData((prevData: any) => ({ ...prevData, ...data }));
      _setCurrentStep(_currentStep + 1);
    }
  };

  const prevStep = () => {
    if (_currentStep > 0) {
      _setCurrentStep(_currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[_currentStep]?.component as any;
  if (!CurrentStepComponent) return null;
  return (
    <CurrentStepComponent
      onPrev={prevStep}
      onNext={nextStep}
      stepperOpen={stepperOpen}
      setStepperOpen={setStepperOpen}
      data={stepData}
      {...steps[_currentStep]?.props}
    />
  );
};
