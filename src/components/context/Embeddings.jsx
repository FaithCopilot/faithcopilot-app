import { useEffect, useState } from "react";

import { FilterTable } from "@/components/FilterTable";
import { ButtonMenu } from "@/components/ButtonMenu";
import { Modal } from "@/components/modals/Modal";

import { useRequest } from "@/hooks/use-request";

import { MigrationTokenModalContent } from "./MigrationToken";
import { FileUploadModalContent } from "./FileUpload";
import { CrawlURLModalContent } from "./CrawlURL";

// TODO: refactor to Icons
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
  //{ accessor: "tags", header: "Tags", minSize: 150 },
  { accessor: "provider", header: "Provider", size: 75 },
  { accessor: "model", header: "model", maxSize: 150 },
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

const EmbeddingsList = () => {
  let { data, error, isLoading } = useRequest("/v1/data");
  data = [
    {
      name: "Name",
      tags: ["Tag 1", "Tag 2"],
      provider: "cohere",
      model: "embed-english-v3.0",
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
  //const actionItems = [
  const actionItems = (item, idx) => [
    {
      icon: <FileSearch2Icon />,
      label: "Edit Embedding", // TODO: i18n
      href: "/zznewish"
    }
  ];

  // map data json such that collections property is a joined string delimited by comma
  data?.forEach((item) => {
    if (Array.isArray(item?.collections)) {
      item.collections = item.collections?.join(", ");
    };
  });

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
        componentEnd={(
          <ButtonMenu
            variant="surface"
            items={[
              {
                icon: <TextCursorInputIcon />,
                label: 'Migration Token',
                onClick: () => setModalConfig({
                  title: 'Enter Migration Token',
                  content: <MigrationTokenModalContent dismiss={() => setModalConfig(null)} />, 
                })
              },
            ]}
            //title="Add Data"
            iconStart={<PlusIcon />}
            iconEnd={<ChevronDownIcon />}
            classNames={{
              button: 'py-4 px-6'
            }}
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
  )
};

const Embedding = ({ id }) => {
  return(
    <div>Embedding {id}</div>
  );
};

const Embeddings = () => {
  const [id, setId] = useState();
  useEffect(() => {
    if (window.location.search) {
      const params = new URL(location.href).searchParams;
      const id = params.get("id");
      setId(id);
    };
  }, []);
  if (id) return <Embedding id={id} />;
  return <EmbeddingsList />;
};

export default Embeddings;
