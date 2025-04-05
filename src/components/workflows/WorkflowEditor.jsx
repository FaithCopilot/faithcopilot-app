import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { ButtonMenu } from "@/components/ButtonMenu";
import { CodeEditor } from "@/components/CodeEditor";
import { FilterTable } from "@/components/FilterTable";
import { CopyButton } from "@/components/buttons/CopyButton";
import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import WFHTTPModule from "@/components/workflows/WFHTTPModule";
import ScriptModule from "@/components/workflows/ScriptModule";
import VariableModule from "@/components/workflows/VariableModule";

import { useRequest } from "@/hooks/use-request";

import {
  ICON_SIZE,
  AddIcon,
  BackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  DeleteIcon,
  EditIcon,
  HTTPIcon,
  MinusIcon,
  MoreIcon,
  RefreshIcon,
  SafetyIcon,
  SaveIcon,
  SelectIcon,
  ServicesIcon,
  ReturnIcon,
  TestIcon,
  VariableIcon,
  WarningIcon
} from "@/components/Icons";

import { truncate } from "@/utils";

const ComponentConstants = {
  VARS: "vars",
  SCRIPT: "script",
  HTTP: "http"
};

const ServiceComponentConstants = {
  DATA: "service/data",
  CONTEXT: "service/context",
  INDEX: "service/index",
  MODEL: "service/model",
  PROFILE: "service/profile",
  SAFETY: "service/safety",
  WORKFLOW: "service/workflow"
};

export const WorkflowContext = createContext();

export const WorkflowProvider = ({ initialState, children }) => {
  const [workflowName, setWorkflowName] = useState(initialState?.name ?? '');
  const [workflowSteps, setWorkflowSteps] = useState(initialState?.steps ?? []);

  useEffect(() => {
    setWorkflowName(initialState?.name ?? '');
    setWorkflowSteps(initialState?.steps ?? []);
  }, [initialState]);

  const addStep = (position, step) => {
    if (position === 0 && workflowSteps?.length > 0) {
      setWorkflowSteps([step, ...workflowSteps]);
      return;
    };
    if (workflowSteps?.length < 1) {
      setWorkflowSteps([step]);
      return;
    };
    setWorkflowSteps([
      ...workflowSteps.slice(0, position),
      step,
      ...workflowSteps.slice(position)
    ]);
  };

  const removeStep = (position) => {
    if (!workflowSteps) return null;
    const filteredSteps = workflowSteps.filter((_, _idx) => _idx !== position);
    setWorkflowSteps(filteredSteps);
  };

  const updateStep = (position, step) => {
    if (!workflowSteps?.[position]) return null;
    const updatedSteps = [...workflowSteps];
    updatedSteps[position] = step;
    setWorkflowSteps(updatedSteps);
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflowName,
        setWorkflowName,
        workflowSteps,
        setWorkflowSteps,
        addStep,
        removeStep,
        updateStep
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

// TODO: JSONSchema for Workflow
const validateJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    // Validate required fields
    const isValid = parsed.every(step => 
      //typeof step.name === 'string' &&
      typeof step.call === 'string' &&
      [
        ComponentConstants.VARS,
        ComponentConstants.SCRIPT,
        ComponentConstants.HTTP,
        //ServiceComponentConstants.SAFETY
      ].includes(step?.call)
    );
    return {
      isValid,
      formatted: JSON.stringify(parsed, null, 2),
      error: isValid ? null : 'Invalid Definition' // TODO: say more
    };
  } catch (error) {
    return {
      isValid: false,
      formatted: jsonString,
      error: error.message
    };
  }
};

const columnItems = [
  { accessor: "name", header: "Name", minSize: 150 },
  { accessor: "createdAt", header: "Created At", size: 100 },
  { accessor: "createdBy", header: "Created By", size: 100 },
];

const WorkflowStepModalContent = ({ step, onStepChange, dismiss }) => {
  const actionItems = (item, idx) => [
    {
      icon: <SelectIcon />,
      label: "Select",
      onClick: () => {
        if (!item?.id) return null;
        onStepChange({
          ...step,
          name: item?.name,
          args: {
            id: item?.id,
          }
        });
      }
    }
  ];

  switch(step?.call) {
    case ComponentConstants.VARS:
      return(
        <VariableModule
          values={step}
          setValues={onStepChange}
          dismiss={dismiss}
        />
      );
    case ComponentConstants.SCRIPT:
      return(
        <ScriptModule
          values={step}
          setValues={onStepChange}
          dismiss={dismiss}
        />
      );
    case ComponentConstants.HTTP:
      return(
        <WFHTTPModule
          proxyURL="/v1/proxy"
          values={step}
          setValues={onStepChange}
          dismiss={dismiss}
        />
      );
    case ServiceComponentConstants.SAFETY:
      return(
        <FilterTable
          //pageSize={10}
          search
          columnItems={columnItems}
          data={data}
          initialState={{
            sorting: [
              {
                id: "createdAt",
                desc: true
              },
            ],
          }}
          actionItems={actionItems}
        />
      );
    default:
      return null;
  };
};

const mapTypeToIcon = (type) => {
  switch(type) {
    case ComponentConstants.VARS:
      return <VariableIcon size={ICON_SIZE} />;
    case ComponentConstants.SCRIPT:
      return <CodeIcon size={ICON_SIZE} />;
    case ComponentConstants.HTTP:
      return <HTTPIcon size={ICON_SIZE} />;
    case ServiceComponentConstants.CONTEXT:
    case ServiceComponentConstants.DATA:
      return <ServicesIcon size={ICON_SIZE} />;
    case ServiceComponentConstants.SAFETY:
      return <SafetyIcon size={ICON_SIZE} />;
    default:
      return <ServicesIcon size={ICON_SIZE} />;
  };
};

const WorkflowStep = ({ idx, step, isActive, onClick }) => {
  const { removeStep, updateStep } = useContext(WorkflowContext);
  const [modalConfig, setModalConfig] = useState(null);
  let stepName = step?.name ?? step?.call ?? '';
  const namedResult = step?.result;
  //if (stepName?.startsWith("service/")) {
  //  stepName = stepName.split("/").pop();
  //};
  const stepType = step?.call;
  return (
    <div 
      className={[
        "w-full cursor-pointer",
        isActive ? "border-2 border-primary-600 rounded-lg" : ''
      ].join(' ')}
      onClick={() => onClick(idx)}
    >
      <div className="w-full flex items-center justify-between surfaces p-2 rounded-lg">
        <div className="w-full flex flex-col md:flex-row items-center">
          <div className="flex flex-row space-x-2">
            <span className="placeholders">{idx+1}.</span>
            {mapTypeToIcon(stepType)}
            <span className="texts text-lg max-w-[200px] md:max-w-[600px] truncate">{stepName}</span>
          </div>
          <div className="md:ms-auto flex flex-row space-x-4 items-center">
            { step?.return && (
              <ReturnIcon size="20" />
            )}
            <span className="placeholders text-sm">{namedResult}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ButtonMenu
            variant="none"
            icon={<MoreIcon size="20" />}
            items={[
              {
                label: `Edit ${truncate(stepName)}`,
                icon: <EditIcon size="20" />,
                onClick: () => setModalConfig({
                  title: stepName,
                  content: (
                    <div className="w-full h-full p-1">
                      <WorkflowStepModalContent 
                        step={step}
                        onStepChange={(newStep) => updateStep(idx, newStep)}
                        dismiss={() => setModalConfig(null)} 
                      />
                    </div>
                  )
                })
              },
              {
                label: "Delete",
                icon: <DeleteIcon color="red" size="20" />,
                onClick: () => removeStep(idx)
              }
            ]}
          />
        </div>
      </div>
      <Modal
        size="lg"
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
        //contentClassName="max-h-[600px]"
      />
    </div>
  );
};

const ServiceSelect = ({ onSelect }) => {
  return(
    <div className="flex flex-col space-y-4 w-full justify-center p-4">
      <Button
        type="button"
        variant="surface"
        icon={<ServicesIcon size={ICON_SIZE} />}
        onClick={() => onSelect({ call: ServiceComponentConstants.SAFETY })}
      >
        <div className="flex flex-row space-x-2">
          <span>Safety</span>
          <span className="text-neutral-500 text-xs pt-2">Reusable Guardrails, Judgements, and more</span>
        </div>
      </Button>
    </div>
  );
};

const CompnentSelect = ({ onSelect }) => {
  return(
    <div className="flex flex-col space-y-4 w-full justify-center p-4">
      {/*
      <SelectContext onSelect={onSelect} />
      <SelectTextInput onSelect={onSelect} />
      <Button
        disabled
        variant="surface"
        icon={<FileIcon />}
      >
        <div className="flex flex-row space-x-2">
          <span>Upload File</span>
          <span className="text-neutral-500 text-xs pt-2">PDFs, Docs, Spreadsheets, and more</span>
        </div>
      </Button>
      <div className="h-1" />
      <div className="border border-1 borders w-full" />
      <div className="h-1" />
      <Button
        disabled
        variant="surface"
        icon={<StarIcon />}
      >
        <div className="flex flex-row space-x-2">
          <span>Favorites</span>
          <span className="text-neutral-500 text-xs pt-2">Recently used and Favorites</span>
        </div>
      </Button>
      <Button
        disabled
        variant="surface"
        icon={<SparkleIcon />}
      >
        <div className="flex flex-row space-x-2">
          <span>Featured</span>
          <span className="text-neutral-500 text-xs pt-2">Popular, Trending, and New</span>
        </div>
      </Button>
      <Button
        disabled
        variant="surface"
        icon={<SparklesIcon />}
      >
        <div className="flex flex-row space-x-2">
          <span>Recommended</span>
          <span className="text-neutral-500 text-xs pt-2">Based on your preferences</span>
        </div>
      </Button>
      */}
      <Button
        type="button"
        variant="surface"
        icon={<VariableIcon size={ICON_SIZE} />}
        onClick={() => onSelect({ call: ComponentConstants.VARS })}
        //onClick={() => onSelect({ name: "vars", call: "vars", assign: [] })}
      >
        <div className="flex flex-row space-x-2">
          <span>Variable</span>
          <span className="text-neutral-500 text-xs pt-2">Define variable values</span>
        </div>
      </Button>
      <Button
        type="button"
        variant="surface"
        icon={<CodeIcon size={ICON_SIZE} />}
        onClick={() => onSelect({ call: ComponentConstants.SCRIPT })}
      >
        <div className="flex flex-row space-x-2">
          <span>Script</span>
          <span className="text-neutral-500 text-xs pt-2">Code for conditional logic, deterministic rules, etc...</span>
        </div>
      </Button>
      <Button
        type="button"
        variant="surface"
        icon={<HTTPIcon size={ICON_SIZE} />}
        onClick={() => onSelect({ call: ComponentConstants.HTTP })}
      >
        <div className="flex flex-row space-x-2">
          <span>HTTP</span>
          <span className="text-neutral-500 text-xs pt-2">APIs, Web Requests, and more</span>
        </div>
      </Button>
      <Modal
        title="Select Service"
        content={<ServiceSelect onSelect={onSelect} />}
        trigger={(
          <Button
            type="button" 
            variant="surface"
            icon={<ServicesIcon size={ICON_SIZE} />}
          >
            <div className="flex flex-row space-x-2">
              <span>Service</span>
              <span className="text-neutral-500 text-xs pt-2">Profiles, Safety, Contexts, and more</span>
            </div>
          </Button>
        )}
      />
    </div>
  );
};

const TestStepFeedback = ({ step, position }) => {
  const [showNodeSelectModal, setShowNodeSelectModal] = useState(false);
  const onSelect = (value) => {
    console.log("Selected: ", value);
  };
  return(
    <Modal
      open={showNodeSelectModal}
      onOpenChange={setShowNodeSelectModal}
      title="Test Step Feedback"
      content={<CompnentSelect onSelect={onSelect} />}
      trigger={<Button icon={<TestIcon size={ICON_SIZE} />}/>}
    />
  );
};

const AddStepButton = ({ disabled, position }) => {
  const { addStep, workflowSteps } = useContext(WorkflowContext);
  const [showNodeSelectModal, setShowNodeSelectModal] = useState(false);
  const onSelect = (_step) => {
    addStep(position, _step);
    setShowNodeSelectModal(false);
  };
  if (disabled) {
    return <Button disabled icon={<AddIcon size={ICON_SIZE} />} />;
  };
  return(
    <Modal
      open={showNodeSelectModal}
      onOpenChange={setShowNodeSelectModal}
      title="Select Component"
      content={<CompnentSelect onSelect={onSelect} />}
      trigger={<Button icon={<AddIcon size={ICON_SIZE} />}/>}
    />
  );
};

const ConnectingLine = () => (
  <div className="w-px h-2 bg-neutral-400 dark:bg-neutral-600 mx-auto my-1" />
);

// TODO: move this to a utility file
const safeStringify = (value) => {
  if (value === null || value === undefined) {
    return '';
  };
  return typeof value !== "string" ? JSON.stringify(value, null, 2) : value; 
};

/**
 * Compares two JSON strings for deep equality
 * @param {string} jsonString1 - First JSON string to compare
 * @param {string} jsonString2 - Second JSON string to compare
 * @returns {boolean} True if the JSON strings are equivalent, false otherwise
 * @throws {Error} If invalid JSON strings are provided
 */
function compareJsonStrings(jsonString1, jsonString2) {
  try {
      // Handle edge cases
      if (jsonString1 === jsonString2) {
          return true;
      }
      
      if (!jsonString1 || !jsonString2) {
          return false;
      }

      // Parse JSON strings into objects
      const obj1 = JSON.parse(jsonString1);
      const obj2 = JSON.parse(jsonString2);

      // Compare stringified sorted versions to handle different key orders
      const normalizedStr1 = JSON.stringify(sortObjectDeep(obj1));
      const normalizedStr2 = JSON.stringify(sortObjectDeep(obj2));

      return normalizedStr1 === normalizedStr2;
  } catch (error) {
      throw new Error(`Invalid JSON string: ${error.message}`);
  }
}

/**
* Recursively sorts object keys and array elements
* @param {*} obj - Value to sort
* @returns {*} Sorted value
*/
function sortObjectDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }

  if (Array.isArray(obj)) {
      return obj.map(sortObjectDeep).sort();
  }

  return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
          sorted[key] = sortObjectDeep(obj[key]);
          return sorted;
      }, {});
}

const WorkflowDefinitionEditor = ({ label }) => {
  const { workflowSteps, setWorkflowSteps } = useContext(WorkflowContext);
  const [jsonValue, setJsonValue] = useState(workflowSteps);
  const [validationError, setValidationError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleJsonChange = useCallback((updatedValue) => {
    setJsonValue(updatedValue);
    const { isValid, error } = validateJSON(updatedValue);
    setValidationError(error);
    if (isValid && (compareJsonStrings(updatedValue, JSON.stringify(workflowSteps)) === false)) {
      setIsDirty(true);
      //setJsonValue(formatted);
    } else {
      setIsDirty(false);
    };
  }, [jsonValue, workflowSteps]);

  const handleJsonUpdate = useCallback(() => {
    const { isValid, formatted, error } = validateJSON(jsonValue);
    if (isValid) {
      const newSteps = JSON.parse(formatted);
      setJsonValue(formatted);
      setWorkflowSteps(newSteps);
      setValidationError(null);
      setIsDirty(false);
    } else {
      setValidationError(error);
    }
  }, [jsonValue]);

  useEffect(() => {
    setJsonValue(JSON.stringify(workflowSteps, null, 2));
  }, [workflowSteps]);

  return(
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <Label label={`${label} Definition`} className="uppercase" />
        <div className="flex flex-row space-x-2">
          <CopyButton
            variant="hover"
            value={jsonValue}
            toast={{ success: (text) => toast({ title: text })}}
          />
          <Button
            disabled={!!validationError || !isDirty}
            variant="primary"
            //label="Update"
            icon={<RefreshIcon size="24" />}
            onClick={handleJsonUpdate}
          />
        </div>
      </div>
      {validationError && (
        <div className="flex items-center space-x-2 text-red-600 mb-2 p-2 bg-red-50 dark:bg-red-950 rounded-md">
          <WarningIcon size="16" />
          <span className="text-sm">{validationError}</span>
        </div>
      )}
      <div className={validationError ? "h-[calc(100%-75px)]" : "h-[calc(100%-25px)]"}>
        <CodeEditor
          mode="javascript"
          value={safeStringify(jsonValue)}
          onChange={handleJsonChange}
        />
      </div>
      {/*
      <textarea
        className={`w-full h-full max-h-[calc(95%)] p-4 inputs ${
          validationError ? 'border-red-300' : 'border-gray-300'
        }`}
        value={safeStringify(jsonValue)}
        onChange={handleJsonChange}
      />
      */}
    </div>
  );
};

const WorkflowHeader = ({
  label,
  url,
  showHistory,
  setShowHistory,
  showState,
  setShowState,
  onTest,
  onSave
}) => {
  const { workflowName, workflowSteps, setWorkflowName } = useContext(WorkflowContext);
  const _url = url?.split("/")?.slice(2)?.join("/");
  return(
    <div className="w-full flex flex-col space-y-2">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col space-y-4">
          <div>
            <Button
              variant="link"
              label={`${label}s`}
              icon={<BackIcon size={ICON_SIZE} />}
              onClick={() => {
                document.location.href = `/services/${_url}`
              }}
              className="hidden md:flex"
            />
            <Button
              icon={<BackIcon size={ICON_SIZE} />}
              onClick={() => {
                document.location.href = `/services/${_url}`
              }}
              className="flex md:hidden"
            />
          </div>
          {/*
          <div className="flex me-auto">
            <Button
              variant="link"
              label={`${showHistory ? "Hide" : "Show"} History`}
              iconStart={showHistory ? <ChevronLeftIcon size={ICON_SIZE} /> : null}
              iconEnd={!showHistory ? <ChevronRightIcon size={ICON_SIZE} /> : null}
              onClick={() => setShowHistory(!showHistory)}
            />
          </div>
          */}
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-2">
            <Button
              //disabled
              variant="outline"
              icon={<TestIcon size={ICON_SIZE} />}
              label="Test"
              //onClick={onTest}
            />
            <Button
              disabled={workflowSteps?.length === 0}
              variant="primary"
              icon={<SaveIcon size={ICON_SIZE} />}
              label="Save"
              onClick={() => onSave({ name: workflowName, steps: workflowSteps })}
            />
          </div>
          <div className="flex ms-auto">
            <Button
              variant="link"
              label={`${showState ? "Hide" : "Show"} Definition`}
              iconStart={showState ? <ChevronLeftIcon size={ICON_SIZE} /> : null}
              iconEnd={!showState ? <ChevronRightIcon size={ICON_SIZE} /> : null}
              onClick={() => setShowState(!showState)}
              className="hidden md:flex"
            />
          </div>
        </div>
      </div>
      <Label label={`${label} Name`} className="uppercase w-full">
        <input
          type="text"
          value={workflowName}
          onChange={(evt) => setWorkflowName(evt.target.value)}
          className="inputs"
        />
      </Label>
    </div>
  );
};

const WorkflowSteps = ({ isTesting }) => {
  const { workflowSteps } = useContext(WorkflowContext);
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="w-full h-full flex flex-col space-y-2 items-center">
      <AddStepButton
        disabled={isTesting}
        position={0}
      />
      {workflowSteps && workflowSteps.length > 0 && <ConnectingLine />}
      {workflowSteps?.map((step, idx) => (
        <React.Fragment key={`${idx}--${step?.name ?? ''}`}>
          {idx > 0 && <ConnectingLine />}
          <WorkflowStep 
            idx={idx}
            step={step}
            isActive={idx === activeStep}
            onClick={() => setActiveStep(idx)}
          />
          {idx < workflowSteps.length-1 && (
            <>
              <ConnectingLine />
              { isTesting ? (
                <div className="w-full flex flex-row justify-between">
                  <div className="ms-auto ps-10">
                    <AddStepButton
                      disabled={isTesting}
                      position={idx+1}
                    />
                  </div>
                  <div className="ms-auto">
                    <TestStepFeedback step={step} position={idx} />
                  </div>
                </div>
              ) : (
                <AddStepButton 
                  disabled={isTesting}
                  position={idx+1}
                />
              )}
            </>
          )}
        </React.Fragment>
      ))}
      { workflowSteps && workflowSteps.length > 0 && (
        <ConnectingLine />
      )}
      { workflowSteps && workflowSteps.length > 0 && (
        <AddStepButton 
          disabled={isTesting}
          position={workflowSteps.length}
        />
      )}
    </div>
  );
};

const WorkflowEditor = ({ label, url }) => {
  const [id, setId] = useState();
  const [template, setTemplate] = useState();
  const [isTesting, setIsTesting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showState, setShowState] = useState(true);

  let _id = id ?? template ?? null;
  const { data: workflow, error, isLoading } = useRequest(_id ? `${url}/${_id}` : null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const _id = urlParams.get("id");
    const _template = urlParams.get("template");
    if (_id) {
      setId(_id);
    };
    if (_template) {
      setTemplate(_template);
    };
    return () => {};
  }, []);

  const handleSave = useCallback(async(_workflow) => {
    if (!_workflow) return null;
    let __workflow = { ..._workflow };
    if (id) {
      __workflow["id"] = id;
      if (!__workflow?.createdAt) {
        __workflow["createdAt"] = new Date().toISOString();
      };
      const res = await fetch(process.env.PUBLIC_API_URL + `${url}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(__workflow)
      });
      if (!res?.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to update ${label}`
        });
        return;
      };
      toast({ title: `${label} updated` });
      return;
    };
    delete __workflow?.createdBy;
    __workflow["createdAt"] = new Date().toISOString();
    // TODO: add createdBy
    const res = await fetch(process.env.PUBLIC_API_URL + url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(__workflow)
    });
    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create ${label}`
      });
      return;
    };
    const resData = await res.json();
    if (!resData?.id) {
      return 
    };
    const _url = url?.split("/")?.slice(2)?.join("/");
    document.location.href = `/services/${_url}/editor?id=${resData.id}`;
  }, [id]);

  return(
    <WorkflowProvider initialState={workflow}>
      <div className="w-full h-full px-2 py-8 flex flex-col md:flex-row overflow-y-auto">
        {/* showHistory && (
          <div className="w-full md:w-1/3 h-full">
            <WorkflowHistory />
          </div>
        )*/}
        <div
          className={[
            "w-full md:1/3 h-full flex flex-col space-y-4 mx-auto px-4",
            (!showHistory && !showState) ? "max-w-[1000px]" : ''
          ].join(' ')}
        >
          <WorkflowHeader
            label={label}
            url={url}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            showState={showState}
            setShowState={setShowState}
            onTest={() => setIsTesting(true)}
            onSave={handleSave}
          />
          <WorkflowSteps isTesting={isTesting} />
        </div>
        {showState && (
          <div className="w-full md:w-1/3 h-full flex justify-center">
            <WorkflowDefinitionEditor label={label} />
          </div>
        )}
      </div>
    </WorkflowProvider>
  );
};

export default WorkflowEditor;