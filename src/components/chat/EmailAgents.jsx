import { useState } from "react";

import { FilterTable } from "@/components/FilterTable";
import { Button } from "@/components/buttons/Button";
import { Modal } from "@/components/modals/Modal";

// TODO: refactor to Icons
import {
  PlusIcon,
  PencilIcon as EditIcon,
  Trash2Icon as DeleteIcon
} from "lucide-react";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 100 },
  { accessor: "profileName", header: "Profile Name", minSize: 100 },
  { accessor: "emailUsername", header: "Email Username", minSize: 100 },
  { accessor: "createdAt", header: "Created", size: 50 },
];

const PreviewTextModalContent = ({ item, dismiss }) => {
  return(
    <div className="flex flex-col space-y-4">
      {JSON.stringify(item, null, 2)}
    </div>
  );
};

const EmailAgents = () => {
  const [modalConfig, setModalConfig] = useState(null);

  const actionItems = (item, idx) => [
    {
      icon: <EditIcon />,
      label: "Edit Email Agent", // TODO: i18n
      onClick: () => setModalConfig({
        title: item?.title ?? 'Preview Text',
        content: <PreviewTextModalContent item={item} dismiss={() => setModalConfig(null)} />, 
      })
    },
    {
      icon: <DeleteIcon />,
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
      emailUsername: "my-cool-email-username",
      createdAt: "2024-04-01",
    },
    {
      name: "My Cool Deployment Name 2",
      profileName: "My Cool Profile Name 2",
      emailUsername: "my-cool-email-username-2",
      createdAt: "2024-03-01",
    }
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
            onClick={() => console.log("Add Email Agent")}
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
export default EmailAgents;