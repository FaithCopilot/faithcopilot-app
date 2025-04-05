import { cloneElement, useEffect, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { CheckIcon } from "@/components/Icons";

export const MultiStepForm = ({ 
  steps, 
  onSubmit, 
  //initialData = {}, 
  submitLabel = 'Submit',
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  /*
  const [formData, setFormData] = useState(initialData);

  // Update form data - can be used by child components
  const updateFormData = (stepId, newData) => {
    console.log("*** FORM DATA", formData);
    console.log("*** updateFormData", stepId, newData);
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...newData
      }
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Props to pass to each step component
  const stepProps = {
    state: formData?.[currentStep] || {},
    setState: (newData) => updateFormData(currentStep, newData)
  };
  */

  return (
    <div className={`max-w-2xl mx-auto p-6 surfaces dark:bg-neutral-950 texts rounded-lg shadow-lg ${className}`}>
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const stepId = step?.id ?? idx+1;
            const stepTitle = step?.title ?? `Step ${stepId}`;
            return(
              <div key={stepId} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
                    ${currentStep >= stepId 
                      ? 'bg-primary-800 border-primary-400 text-white' 
                      : 'border-gray-300 text-gray-300'
                    }`}
                >
                  {currentStep > stepId ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span>{stepId}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= stepId ? 'text-primary-400' : 'text-gray-500'
                }`}>
                  {stepTitle}
                </span>
                {idx !== steps.length - 1 && (
                  <div className={`w-6 h-1 mx-4 ${
                    currentStep > stepId ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Content */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {steps.map((step, idx) => {
          const stepId = step?.id ?? idx+1;
          return(
            <div
              key={stepId}
              className={currentStep === stepId ? 'block' : 'hidden'}
            >
              {/*cloneElement(step.component, { ...stepProps, stepId })*/}
              {step?.component}
            </div>
          );
        })}
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="link"
            onClick={() => setCurrentStep(prev => prev - 1)}
            //disabled={currentStep === 1}
            className={currentStep === 1 ? "hidden" : "block"}
          >
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              type="button"
              variant="primary"
              //onClick={handleSubmit}
              onClick={() => onSubmit()}
            >
              {submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="ms-auto"
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};