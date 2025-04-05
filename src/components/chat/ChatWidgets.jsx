import { useEffect, useState } from "react";

import { CodeEditor } from "@/components/CodeEditor";
import { FilterTable } from "@/components/FilterTable";
import { Button } from "@/components/buttons/Button";
import { CopyButton } from "@/components/buttons/CopyButton";
import { Label } from "@/components/fields/Label";
import { KeyValue } from "@/components/fields/KeyValue";
import { Modal } from "@/components/Modal";
import { MultiStepForm } from "@/components/MultiStepForm";
import { Select } from "@/components/fields/Select";
import { toast } from "@/components/Toast";

import {
  ICON_SIZE,
  AddIcon,
  EditIcon,
  DeleteIcon,
  SelectIcon
} from "@/components/Icons";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 100 },
  { accessor: "profileName", header: "Profile Name", minSize: 100 },
  { accessor: "clientId", header: "Client ID", size: 50 },
  { accessor: "createdBy.name", header: "Created By", minSize: 100, maxSize: 150 },
  { accessor: "createdAt", header: "Created At", size: 100 },
];

const PreviewTextModalContent = ({ item, dismiss }) => {
  return(
    <div className="flex flex-col space-y-4">
      {JSON.stringify(item, null, 2)}
    </div>
  );
};

const SnippetModule = () => {
  const code = `
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-xxxxxxxx-x', 'xxxxxx.com');
    ga('send', 'pageview');
  </script>
  `;
  const [_value, _setValue] = useState(code);
  return(
    <div className="w-full flex flex-row space-x-4">
      <Label label="Code Snippet" className="uppercase flex flex-row">
        <div className="w-[700px] h-[200px] overflow-y-auto surfaces rings rounded px-2">
          <CodeEditor
            border
            mode="javascript"
            value={_value}
            onChange={(evt) =>
              _setValue(evt.target.value)
              /*
              _setValue({
                ..._value,
                code: value
              })
              */
            }
          />
        </div>
      </Label>
      <div className="pt-6">
        <CopyButton value={_value} toast={{ success: (text) => toast({ title: text })}} />
      </div>
    </div>
  );
};

const OriginsModule = ({ defaultValues, values, state, setState }) => {
  useEffect(() => {
    if (!state?.origins) {
      setState({
        ...state,
        origins: values?.origins ?? defaultValues ?? []
      });
    };
  }, [state?.origins]);
  return(
    <Label label="Origins" className="uppercase">
      <KeyValue
        values={state?.origins ?? []}
        onChangeValues={(_values) =>
          setState({
            ...state,
            origins: _values
          })
        }
      />
    </Label>
  );
};

const RegisterProfileForm = ({ defaultValues, values, state, setState }) => {
  const [_values, _setValues] = useState(state ?? values ?? defaultValues ?? {});
  return(
    <div className="flex flex-col space-y-4 h-full w-full max-w-[350px] md:max-w-full">
      <Label label="Name" className="uppercase">
        <input
          type="text"
          value={_values?.name ?? ''}
          onChange={(evt) =>
            _setValues({
              ..._values,
              name: evt.target.value
            })
          }
          className="inputs"
        />
      </Label>
      <Label label="Chat Profile" className="uppercase">
        <Select
          items={[
            { label: "My Cool Chat Profile", value: "123XYZ" },
            { label: "My Cool Chat Profile 2", value: "124XYZ" },
            //{ label: "DELETE", value: "DELETE" },
          ]}
          value={_values?.profile ?? ''}
          onChange={(value) =>
            _setValues({ ..._values, profile: value })
          }
          placeholder="Select"
        />
      </Label>
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
      title: "Profile",
      component: (
        <RegisterProfileForm
          //defaultValues={_item?.profile}
          values={_item?.profile}
        />
      )
    },
    {
      id: 2,
      title: "Origins",
      component: (
        <OriginsModule defaultValues={[]} values={_item?.origins} />
      )
    },
    {
      id: 3,
      title: "Code Snippet",
      component: (
        <SnippetModule />
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

const ChatWidgets = () => {
  const [modalConfig, setModalConfig] = useState(null);

  const actionItems = (item, idx) => [
    {
      icon: <SelectIcon size={ICON_SIZE} />,
      label: "View Code Snippet", // TODO: i18n
      onClick: () => setModalConfig({
        title: (item?.name || item?.title) ?? "Chat Widget Code Snippet",
        content: <SnippetModule item={item} dismiss={() => setModalConfig(null)} />, 
      })
    },
    {
      icon: <EditIcon size={ICON_SIZE} />,
      label: "Edit Chat Widget", // TODO: i18n
      onClick: () => setModalConfig({
        title: item?.title ?? 'Preview Text',
        content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    },
    {
      icon: <DeleteIcon size={ICON_SIZE} />,
      label: "Delete", // TODO: i18n
      onClick: () => setModalConfig({
        title: item?.title ?? 'Preview Text',
        content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    }
  ];

  const data = [
    {
      name: "My Cool Deployment Name",
      profileName: "My Cool Profile Name",
      clientId: "ey...c1HM",
      createdBy: {
        name: "zdmc23@gmail.com"
      },
      createdAt: "2024-04-01",
    },
    {
      name: "My Cool Deployment Name 2",
      profileName: "My Cool Profile Name 2",
      clientId: "ey...c1HM",
      createdBy: {
        name: "zdmc23@gmail.com"
      },
      createdAt: "2024-04-01",
    },
  ];

  return(
    <div>
      <FilterTable
        search
        columnItems={columnItems}
        data={data}
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
              title: "Register New Chat Widget",
              content: <ModalContent dismiss={() => setModalConfig(null)} />, 
            })}
          />
        )}
      />
      <Modal
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
        cancel
      />
    </div>
  );
};
export default ChatWidgets;