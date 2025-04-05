import { useCallback, useEffect, useState } from "react";

import { FilterTable } from "@/components/FilterTable";
import { Modal } from "@/components/Modal";
import { Label } from "@/components/fields/Label";
import { Button } from "@/components/buttons/Button";
import { CopyButton } from "@/components/buttons/CopyButton";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { KeyValue } from "@/components/fields/KeyValue";
import { MultiStepForm } from "@/components/MultiStepForm";
import NoResultsFound from "@/components/NoResults";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  ICON_SIZE,
  AddIcon,
  DeleteIcon,
  EditIcon,
  MetadataIcon,
} from "@/components/Icons";

const columnItems = [
  { accessor: "name", header: "Name", size: 300 },
  { accessor: "appId", header: "App ID", size: 300 },
  { accessor: "createdBy.name", header: "Created By", size: 200 },
  { accessor: "createdAt", header: "Created At", size: 200 },
];

const defaultParams = [
  {
    id: "brand",
    key: "brand",
    value: ''
  },
  {
    id: "prompt-button-1",
    label: "Prompt Button 1", 
    key: "prompt-button-1",
    value: 'Training Materials: Videos, PDFs, etc.'
  },
  {
    id: "color-primary",
    key: "Primary Color",
    value: ''
  },
  {
    id: "color-secondary",
    key: "Secondary Color",
    value: ''
  },
  {
    id: "color-tertiary",
    key: "Tertiary Color",
    value: ''
  },
  {
    id: "color-links",
    key: "Link Color",
    value: ''
  }
];

const ParametersConfig = ({ required, readOnly, label, params, setParams }) => (
  <Label label={label} className="uppercase" help={`
    Available parameters:
    - brand
    - prompt-button-1
    - prompt-button-2
    - prompt-button-3
    - color-primary
    - color-secondary
    - color-tertiary
    - color-links
  `}>
    <KeyValue
      readOnly={readOnly}
      values={params}
      onChangeValues={setParams}
    />
  </Label>
);

const ModalContent = ({ readOnly, item, isNew, dismiss }) => {
  const [name, setName] = useState(item?.name ?? '');
  const translatedName = name?.toLowerCase()?.replace(/\s/g, "-");
  const [appId, setAppId] = useState(item?.appId ?? translatedName ?? '');
  const [params, setParams] = useState(item?.params ?? defaultParams);
  useEffect(() => {
    if (translatedName) setAppId(translatedName);
    return;
  }, [translatedName]);
  const steps = [
    {
      title: "Register",
      component: (
        <div className="flex flex-col space-y-4">
          <Label label="Name" className="uppercase">
            <input
              readOnly={readOnly}
              type="text"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              className="inputs"
            />
          </Label>
          <Label label="App ID" className="uppercase">
            <input
              readOnly
              type="text"
              value={appId}
              className="inputs"
            />
          </Label>
        </div>
      )
    },
    {
      title: "Brand",
      component: (
        <ParametersConfig
          readOnly={readOnly}
          label="Brand"
          params={params}
          setParams={setParams}
        />
      )
    },
    {
      title: "Deploy",
      component: (
        <div className="flex flex-col space-y-4">
          <Label label="URL" className="uppercase">
            <div className="flex flex-row space-x-2 items-center">
              <input
                readOnly
                type="text"
                value={`https://staging.faithcopilot.com/chat/apps?id=${appId}`}
                className="inputs w-full min-w-[500px]"
              />
              <CopyButton
                value={`https://staging.faithcopilot.com/chat/apps?id=${appId}`}
                toast={{ success: (text) => toast({ title: text })}}
              />
            </div>
          </Label>
        </div>
      )
    }
  ];
  const handleSubmit = useCallback(async() => {
    if (readOnly) {
      dismiss();
      return;
    };
    const data = {
      type: "chat/apps/v1",
      name,
      appId,
      params
    };
    const res = await fetch(process.env.PUBLIC_API_URL + "/v1/chat/apps", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    });
    if (!res?.ok) {
      console.error("Failed to fetch", res);
      toast({ variant: "destructive", title: "Error", description: "Unable to deploy the Chat App. Please try again" });
    };
    toast({ title: "Chat App deployed" });
    dismiss();
  }, [name, appId, params, readOnly]);
  let submitLabel = "Deploy Chat App";
  if (!isNew && !readOnly) {
    submitLabel = "Update Chat App";
  };
  if (readOnly) {
    submitLabel = "Close";
  };
  return(
    <div className="h-full max-h-[750px] w-full">
      <MultiStepForm
        steps={steps}
        onSubmit={handleSubmit}
        //initialData={{}}
        submitLabel={submitLabel}
      /> 
    </div>
  );
};

const Apps = () => {
  const [modalConfig, setModalConfig] = useState(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState(null);
  const [modalState, setModalState] = useState({});

  const { data, error, isLoading, mutate } = useRequest("/v1/chat/apps");
  const mappedData = data?.map((item) => ({
    ...item,
    createdAt: item?.createdAt?.split("T")[0],
    createdBy: {
      ...item?.createdBy,
      name: item?.createdBy?.verified === true ? `${item?.createdBy?.name} ✅` : item?.createdBy?.name
    }
  }));

  const actionItems = (item, idx) => [
    {
      icon: <MetadataIcon />,
      label: "View Metadata", // TODO: i18n
      onClick: () => setModalConfig({
        title: (item?.title || item?.name) ?? '',
        content: (
          <ModalContent
            readOnly
            item={item}
            dismiss={() => setModalConfig(null)}
          /> 
        )
      })
    },
    {
      icon: <EditIcon />,
      label: "Edit Model", // TODO: i18n
      onClick: () => setModalConfig({
        title: (item?.title || item?.name) ?? '',
        content: (
          <ModalContent
            isNew={!item}
            dismiss={() => setModalConfig(null)}
          /> 
        )
      })
    },
    {
      icon: <DeleteIcon size={ICON_SIZE} className="text-red-700" />,
      label: "Delete", // TODO: i18n
      onClick: () => setDeleteModalConfig({ ...item, confirmValue: item?.name?.trim()?.length > 1 ? item.name : item?.model }),
    }
  ];

  return(
    <div>
      <FilterTable
        search
        columnItems={columnItems}
        data={mappedData}
        initialState={{
          sorting: [
            {
              id: "createdAt",
              asc: true
            },
          ],
        }}
        actionItems={actionItems}
        componentEnd={(
          <Button
            variant="surface"
            icon={<AddIcon size={ICON_SIZE} />}
            onClick={() => setModalConfig({
              title: "Deploy Hosted App",
              content: <ModalContent isNew={true} dismiss={() => setModalConfig(null)} /> 
            })}
          />
        )}
      />
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
        onSuccess={async(_item) => {
          if (!_item?.id) return;
          const res = await fetch(process.env.PUBLIC_API_URL + `/v1/chat/apps/${_item?.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res?.ok) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to delete Chat App"
            });
            return;
          };
          toast({ title: "Chat App deleted" });
          setDeleteModalConfig(null);
        }}
        onError={(_error) => {
          console.error(_error);
          toast({ variant: "destructive", title: "Error", description: _error?.message ?? '' });
        }}
        open={deleteModalConfig}
        onOpenChange={(open) => open === false && setDeleteModalConfig(null)}
      />
      { (!data || data?.length < 1) && <NoResultsFound type="Chat Apps" /> }
    </div>
  );
};
export default Apps;