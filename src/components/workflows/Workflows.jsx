import { useState } from "react";

import { ButtonMenu } from "@/components/ButtonMenu";
import { FilterTable } from "@/components/FilterTable";
import { Modal } from "@/components/modals/Modal";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  PlusIcon,
  FileSearch2Icon,
  TextCursorInputIcon,
  FileUpIcon,
  BugIcon,
  ChevronDownIcon
} from "lucide-react";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 150 },
  { accessor: "tags", header: "Tags", minSize: 150 },
  { accessor: "type", header: "Type", size: 75 },
  { accessor: "createdAt", header: "Created", size: 50 },
  { accessor: "modifiedAt", header: "Modified", size: 50 },
];

const PreviewTextModalContent = ({ item, dismiss }) => {
  return(
    <div className="flex flex-col space-y-4">
      {JSON.stringify(item, null, 2)}
    </div>
  );
};

const Workflows = ({ withButton, actionItems }) => {
  let { data, error, isLoading } = useRequest("/v1/data");
  data = [
    {
      name: "Workflow 1",
      tags: ["Tag 1", "Tag 2"],
      createdAt: "2024-04-01T12:00:00Z",
      modifiedAt: "2024-04-01T12:00:00Z",
    },
    {
      name: "Workflow 2",
      tags: ["Tag 1", "Tag 2"],
      createdAt: "2024-04-01T12:00:00Z",
      modifiedAt: "2024-04-01T12:00:00Z",
    }
  ]
  const [modalConfig, setModalConfig] = useState(null);
/*
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message
    });
    return null;
  };
*/

  // TODO: handle error: "r is not a function"
  if (!actionItems) {
    actionItems = (item, idx) => [
      {
        icon: <PlusIcon />,
        label: "New Workflow", // TODO: i18n
        onClick: () => setModalConfig({
          title: item?.title ?? 'Preview Text',
          content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
        })
      }
    ];
  };

  // map data json such that collections property is a joined string delimited by comma
  data?.forEach((item) => {
    if (Array.isArray(item?.collections)) {
      item.collections = item.collections?.join(", ");
    };
  });

  let Button = null;
  if (withButton) {
    Button = ( 
      <ButtonMenu
        variant="surface"
        items={[
          {
            icon: <PlusIcon />,
            label: 'New Workflow',
            onClick: () => console.log("*** NEW WORKFLOW")
          },
        ]}
        title="Add Data"
        iconStart={<PlusIcon />}
        iconEnd={<ChevronDownIcon />}
        classNames={{
          button: 'py-4 px-6'
        }}
      />
    );
  }
  return (
    <div>
      <FilterTable
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
        componentEnd={Button}
      />
      <Modal
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
      />
    </div>
  )
};
export default Workflows;
