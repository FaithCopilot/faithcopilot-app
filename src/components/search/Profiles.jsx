import { useState } from "react";

import { Button } from "@/components/buttons/Button";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { FilterTable } from "@/components/FilterTable";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  ICON_SIZE,
  AddIcon,
  CloneIcon,
  DeleteIcon,
  EditIcon,
  MetadataIcon
} from "@/components/Icons";

const columnItems = [
  { accessor: "name", header: "Name" },
  { accessor: "createdBy.name", header: "Created By", minSize: 100, maxSize: 150 },
  { accessor: "createdAt", header: "Created At", size: 100 },
];

const Profiles = () => {
  const { data, error, isLoading, mutate } = useRequest("/v1/search/profiles");
  const [deleteModalConfig, setDeleteModalConfig] = useState(null);

  const actionItems = (item, idx) => {
    if (!item) return [];
    // TODO: constant?
    if (item?.createdBy?.id === "1") {
      return [
        {
          icon: <CloneIcon size={ICON_SIZE} />,
          label: "Clone Search Profile", // TODO: i18n
          onClick: () => { if (item?.id) { document.location.href = `/services/search/profiles/editor?template=${item.id}` }}
        },
        /* TODO: implement metadata
        {
          icon: <MetadataIcon size={ICON_SIZE} />,
          label: "View Metadata", // TODO: i18n
          onClick: () => console.log("*** METADATA ***", item)
        }
        */
      ];
    };
    return [
      {
        icon: <EditIcon size={ICON_SIZE} />,
        label: "Edit Search Profile", // TODO: i18n
        onClick: () => { if (item?.id) { document.location.href = `/services/search/profiles/editor?id=${item.id}` }}
      },
      /* TODO: implement metadata
      {
        icon: <MetadataIcon size={ICON_SIZE} />,
        label: "View Metadata", // TODO: i18n
        onClick: () => console.log("*** METADATA ***", item)
      },
      */
      {
        icon: <DeleteIcon size={ICON_SIZE} className="text-red-700" />,
        label: "Delete", // TODO: i18n
        onClick: () => setDeleteModalConfig({ ...item, confirmValue: item?.name }),
        //className: "text-red-500"
      }
    ];
  };

  const mappedData = data?.map?.(item => {
    return {
      ...item,
      createdAt: item?.createdAt?.split("T")?.[0]
    };
  });

  return(
    <div
      className={[
        "py-1 max-h-[calc(67%)] w-full overflow-y-auto",
        mappedData?.length > 15 ? "h-full" : ''
      ].join(" ")}
    >
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
            onClick={() => { document.location.href = "/services/search/profiles/editor" }}
          />
        )}
        className="h-full overflow-y-auto"
      />
      <ConfirmDeleteModal
        title="Delete Profile?"
        data={deleteModalConfig}
        onSuccess={async(_item) => {
          if (!_item?.id) return;
          const res = await fetch(process.env.PUBLIC_API_URL + `/v1/search/profiles/${_item?.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res?.ok) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to delete Search Profile"
            });
            return;
          };
          toast({ title: "Search Profile deleted" });
          setDeleteModalConfig(null);
          mutate();
        }}
        onError={(_error) => {
          console.error(_error);
          toast({ variant: "destructive", title: "Error", description: _error?.message ?? '' });
        }}
        open={deleteModalConfig}
        onOpenChange={(open) => open === false && setDeleteModalConfig(null)}
      />
    </div>
  );
};
export default Profiles;