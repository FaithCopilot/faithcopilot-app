import { useEffect, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { FilterTable } from "@/components/FilterTable";
import { KeyValue } from "@/components/fields/KeyValue";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Modal } from "@/components/Modal";
import { HTTPModule } from "@/components/HTTPModule";
import { MultiStepForm } from "@/components/MultiStepForm";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  AddIcon,
  DeleteIcon,
  EditIcon,
} from "@/components/Icons";

const columnItems = [
  { accessor: "name", header: "Name", size: 200 },
  { accessor: "provider", header: "Provider", size: 75 },
  { accessor: "namespace", header: "Namespace", size: 150 },
  { accessor: "createdBy.name", header: "Created By", minSize: 100, maxSize: 150 },
  { accessor: "createdAt", header: "Created At", size: 100 },
];

const ParametersModule = ({ defaultValues, values, state, setState }) => {
  useEffect(() => {
    if (!state?.params) {
      setState({
        ...state,
        params: values?.params ?? defaultValues ?? []
      });
    };
  }, [state?.params]);
  return(
    <Label label="Parameters" className="uppercase">
      <KeyValue
        values={state?.params ?? []}
        onChangeValues={(_values) =>
          setState({
            ...state,
            params: _values
          })
        }
      />
    </Label>
  );
};

const HTTPTesterModule = ({ state }) => {
  const [value, setValue] = useState('');
  return(
    <div className="flex flex-col space-y-4">
      <Label label="Input" className="uppercase">
        <textarea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          className="inputs w-full h-[200px]"
        />
      </Label>
      <div className="flex pb-8 ms-auto">
        <Button label="Test" onClick={() => console.log("*** PROXY ***")} />
      </div>
    </div>
  );
};

const ModalContent = ({ item, dismiss, state, setState }) => {
  const isNew = !item;
  const _item = { ...item };
  const defaultModelParams = [
    {
      id: "temperature",
      key: "temperature",
      value: 0.3
    },
    {
      id: "top_p",
      key: "top_p",
      value: 0.9
    },
    {
      id: "frequency_penalty",
      key: "frequency_penalty",
      value: 0.0
    },
    {
      id: "presence_penalty",
      key: "presence_penalty",
      value: 0.0
    },
    {
      id: "max_tokens",
      key: "max_tokens",
      value: 1000
    },
    {
      id: "stop",
      key: "stop",
      //value: `["\\n"]`
      value: ''
    }
  ];
  const steps = [
    {
      id: 1,
      title: 'Connect',
      component: (
        <HTTPModule
          proxyURL="/v1/proxy"
          defaultValues={_item?.http}
        />
      )
    },
    {
      id: 2,
      title: 'Configure',
      component: (
        <ParametersModule defaultValues={defaultModelParams} values={_item?.params} />
      )
    },
    {
      id: 3,
      title: 'Test',
      component: (
        <HTTPTesterModule />
      )
    }
  ];
  const handleSubmit = async(data) => {
    console.log("*** handleSubmit", data);
    //const response = await fetch("/v1/models", { method: "POST", body: JSON.stringify(data) });
    //const json = await response.json();
    //console.log("*** handleSubmit response", json);
    dismiss();
  };
  return(
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      //initialData={{}}
      submitLabel={ isNew ? "Register New Model" : "Save" }
    /> 
  );
};

const Models = () => {
  const [modalConfig, setModalConfig] = useState(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState(null);
  const [modalState, setModalState] = useState({});

  const actionItems = (item, idx) => [
    {
      icon: <EditIcon />,
      label: "Edit Model", // TODO: i18n
      onClick: () => setModalConfig({
        title: (item?.title || item?.name) ?? '',
        content: <ModelModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    },
    {
      icon: <DeleteIcon />,
      label: "Delete", // TODO: i18n
      onClick: () => setDeleteModalConfig({ ...item, confirmValue: item?.name }),
      //className: "text-red-500"
    }
  ];

  const { data, error, isLoading } = useRequest("/v1/indexes");
  const mappedData = data?.map((item) => ({ ...item, createdAt: item?.createdAt?.split("T")[0] })) ?? [];

  //if (isLoading) return <div>Loading...</div>;
  if (error) {
    toast({ variant: "destructive", title: "Error", description: error?.message ?? '' });
  };

  return(
    <div className="h-full w-full">
      <div className="max-h-[700px]">
        <FilterTable
          //pageSize={10}
          search
          columnItems={columnItems}
          data={mappedData}
          initialState={{
            sorting: [
              {
                id: "createdAt",
                desc: true
              },
            ],
          }}
          actionItems={actionItems}
          componentEnd={(
            <Button
              variant="surface"
              icon={<AddIcon size="24" />}
              onClick={() => setModalConfig({
                title: "Register New Model",
                content: <ModalContent dismiss={() => setModalConfig(null)} />, 
              })}
            />
          )}
        />
      </div>
      <Modal
        //fullscreen
        size="md"
        //description="Model Configuration"
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
        state={modalState}
        setState={setModalState}
      />
      <ConfirmDeleteModal
        title="Delete Model?"
        data={deleteModalConfig}
        onSuccess={async(data) => {
          toast({ title: "Model deleted" });
          setDeleteModalConfig(null);
        }}
        onError={(error) => {
          console.error(error);
          toast({ variant: "destructive", title: "Error", description: error?.message ?? '' });
        }}
        open={deleteModalConfig}
        onOpenChange={(open) => open === false && setDeleteModalConfig(null)}
      />
    </div>
  );
};
export default Models;