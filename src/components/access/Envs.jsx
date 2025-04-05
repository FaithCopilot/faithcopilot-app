import { useState } from "react";

import { Label } from "@/components/fields/Label";
import { Button } from "@/components/buttons/Button";
import { Checkbox } from "@/components/fields/Checkbox";
import { FilterTable } from "@/components/FilterTable";
import { Modal } from "@/components/modals/Modal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  ICON_SIZE,
  AddIcon,
  DeleteIcon
} from "@/components/Icons";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 200 },
  { accessor: "key", header: "Key", size: 200 },
  { accessor: "value", header: "Value", size: 100 },
  { accessor: "createdBy.name", header: "Created By", size: 150 },
  { accessor: "createdAt", header: "Created At", size: 100 },
];

// TODO: componentize this
const NoResultsFound = ({ type }) => (
  <div className="flex flex-col items-center justify-center">
    No {type} found
  </div>
);

const Envs = () => {
  const [newKVState, setNewKVState] = useState({ isSecret: true });
  let { data, error, isLoading, mutate } = useRequest("/v1/access/envs");

  const mappedData = data?.map((item) => ({
    ...item,
    createdAt: item?.createdAt?.split('T')?.[0],
    createdBy: {
      ...item?.createdBy,
      name: item?.createdBy?.verified === true ? `${item?.createdBy?.name} ✅` : item?.createdBy?.name
    }
  }));

  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState(null);

  /*
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message
    });
  };
  */

  const actionItems = (item, idx) => [
    {
      icon: <DeleteIcon size={ICON_SIZE} className="text-red-700" />,
      label: "Revoke Env Var",
      onClick: () => setDeleteModalConfig({ ...item, confirmValue: item?.key }),
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      <FilterTable
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
          <Modal
            open={!!envModalOpen}
            onOpenChange={setEnvModalOpen}
            size="md"
            title="New Env Var"
            content={(
              <div className="px-2 pt-2 pb-8 w-full flex flex-col space-y-4">
                <Label label="Name" className="uppercase">
                  <input
                    type="text"
                    value={newKVState?.name ?? ''}
                    onChange={(evt) => setNewKVState?.({ ...newKVState, name: evt.target.value })}
                    placeholder="Name"
                    className="w-full inputs"
                  />
                </Label>
                <div className="w-full flex flex-row space-x-2 items-center">
                  <Label label="Key" className="uppercase">
                    <input
                      type="text"
                      value={newKVState?.key ?? ''}
                      onChange={(evt) => setNewKVState?.({ ...newKVState, key: evt.target.value })}
                      placeholder="Key"
                      className="w-full inputs"
                    />
                  </Label>
                  <Label label="Value" className="uppercase">
                    <input
                      type="text"
                      value={newKVState?.value ?? ''}
                      onChange={(evt) => setNewKVState?.({ ...newKVState, value: evt.target.value })}
                      placeholder="Value"
                      className="w-full inputs"
                    />
                  </Label>
                </div>
                <Label label="Secret" className="uppercase" help={(
                  <span>Check to mask the value (eg, *****)</span>
                )}>
                  <Checkbox
                    checked={newKVState?.isSecret ?? false}
                    onChange={(evt) => setNewKVState?.({ ...newKVState, isSecret: evt.target.checked })}
                  />
                </Label>
              </div>
            )}
            cancel
            footer={(
              <Button
                disabled={!newKVState?.key || !newKVState?.value}
                variant="primary"
                label="Create"
                onClick={async() => {
                  const _keyState = { ...newKVState };
                  _keyState["createdAt"] = new Date().toISOString();
                  const res = await fetch(process.env.PUBLIC_API_URL + "/v1/access/envs", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(_keyState)
                  });
                  if (!res?.ok) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to create Env Var"
                    });
                    return;
                  }; 
                  mutate();
                  setEnvModalOpen(false);
                  setNewKVState({ isSecret: true });
                }}
              />
            )}
            trigger={(
              <Button
                variant="surface"
                icon={<AddIcon size={ICON_SIZE} onClick={() => setNewKVState({ isSecret: true })} />}
              />
            )}
          />
        )}
      />
      <ConfirmDeleteModal
        title="Delete Env Var?"
        data={deleteModalConfig}
        onSuccess={async(_item) => {
          if (!_item?.id) return;
          const res = await fetch(process.env.PUBLIC_API_URL + `/v1/access/envs/${_item?.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res?.ok) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to delete Env Var"
            });
            return;
          };
          toast({ title: "Env Var deleted" });
          setDeleteModalConfig(null);
          setNewKVState({})
          mutate();
        }}
        onError={(_error) => {
          console.error(_error);
          toast({ variant: "destructive", title: "Error", description: _error?.message ?? '' });
        }}
        open={deleteModalConfig}
        onOpenChange={(_open) => _open === false && setDeleteModalConfig(null)}
      />
      { (!data || data?.length < 1) && <NoResultsFound type="Env Vars" /> }
    </div>
  )
};
export default Envs;