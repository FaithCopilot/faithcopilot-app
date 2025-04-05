import { useState } from "react";

import { FilterTable } from "@/components/FilterTable";
import { Button } from "@/components/buttons/Button";
import { Modal } from "@/components/modals/Modal";

// TODO: refactor to Icons
import {
  PlusIcon,
  FileSearch2Icon,
  ChevronDownIcon,
  Trash2Icon
} from "lucide-react";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 100 },
  { accessor: "modelName", header: "Model Name", size: 50 },
  { accessor: "createdAt", header: "Created", size: 50 },
];

const PreviewTextModalContent = ({ item, dismiss }) => {
  return(
    <div className="flex flex-col space-y-4">
      {JSON.stringify(item, null, 2)}
    </div>
  );
};

const Profiles = () => {
  const [modalConfig, setModalConfig] = useState(null);

  const actionItems = (item, idx) => [
    {
      icon: <FileSearch2Icon />,
      label: "Edit Chat Profile", // TODO: i18n
      onClick: () => setModalConfig({
        title: item?.title ?? 'Preview Text',
        content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    },
    {
      icon: <Trash2Icon />,
      label: "Delete", // TODO: i18n
      onClick: () => setModalConfig({
        title: item?.title ?? 'Preview Text',
        content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    }
  ];

  const data = [
    {
      name: "My Cool Chat Profile",
      modelName: "My Cool Model Name",
      createdAt: "2024-04-01",
    },
    {
      name: "My Cool Deployment Name 2",
      modelName: "My Cool Profile Name 2",
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
            icon={<PlusIcon />}
            onClick={() => console.log("Add Chat Profile")}
            className="p-4 w-14"
          />
        )}
      />
      <Modal
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
      />
    </div>
  );
};
export default Profiles;