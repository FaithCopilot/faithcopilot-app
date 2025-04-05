import { useState } from "react";

import { DatePicker } from "@/components/DatePicker";

import { FilterTable } from "@/components/FilterTable";
import { Label } from "@/components/fields/Label";
import { Button } from "@/components/buttons/Button";
import { CopyButton } from "@/components/buttons/CopyButton";
import { Modal } from "@/components/modals/Modal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import {
  ICON_SIZE,
  AddIcon,
  DeleteIcon
} from "@/components/Icons";

import { getEndOfDayUTC } from "@/utils";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 200 },
  { accessor: "sk", header: "Secret Key", size: 75 },
  { accessor: "createdBy.name", header: "Created By", size: 75 },
  { accessor: "createdAt", header: "Created At", size: 75 },
  { accessor: "exp", header: "Expires", size: 75 },
];

// TODO: componentize this
const NoResultsFound = ({ type }) => (
  <div className="flex flex-col items-center justify-center">
    No {type} found
  </div>
);

const APIKeys = () => {
  const [newKeyState, setNewKeyState] = useState({});
  let { data, error, isLoading, mutate } = useRequest("/v1/access/api-keys");

  const mappedData = data?.map((item) => ({
    ...item,
    createdAt: item?.createdAt?.split('T')?.[0],
    exp: item?.exp?.split('T')?.[0],
  }));

  const [modalConfig, setModalConfig] = useState(null);
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
      label: "Revoke API Key",
      onClick: () => setDeleteModalConfig({ ...item, confirmValue: item?.name }),
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
            size="md"
            title="Create New API Key"
            content={(
              <div className="p-2 w-full flex flex-col space-y-4 justify-center">
                <Label label="Name" className="uppercase">
                  <input
                    id="label"
                    type="text"
                    value={newKeyState?.name ?? ''}
                    onChange={(evt) => setNewKeyState?.({ ...newKeyState, name: evt.target.value })}
                    placeholder="My API Key"
                    className="w-full inputs"
                  />
                </Label>
                <Label label="Expiration Date" className="uppercase">
                  <DatePicker
                    value={newKeyState?.exp ?? new Date()}
                    onChange={(_date) => setNewKeyState({ ...newKeyState, exp: _date })}
                  />
                </Label>
              </div>
            )}
            cancel
            footer={(
              <Button
                disabled={!newKeyState?.name || !newKeyState?.exp}
                variant="primary"
                label="Create"
                onClick={async() => {
                  const _keyState = { ...newKeyState };
                  _keyState["exp"] = getEndOfDayUTC(newKeyState?.exp).toISOString();
                  _keyState["exp"] = _keyState["exp"].split('T')?.[0];
                  _keyState["createdAt"] = new Date().toISOString();
                  const res = await fetch(process.env.PUBLIC_API_URL + "/v1/access/api-keys", {
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
                      description: "Failed to create API Key"
                    });
                    return;
                  }; 
                  const data = await res.json();
                  const apiKey = data?.key;
                  setModalConfig({
                    title: "Copy New API Key",
                    content: (
                      <div className="flex flex-col space-y-4">
                        <span className="text-sm placeholders">
                          Copy the API key below and store it in a safe place. You will not be able to see it again!
                        </span>
                        <Label label="API Key" className="uppercase">
                          <div className="flex flex-row space-x-2 items-center">
                            <input
                              disabled
                              id="label"
                              type="text"
                              value={apiKey}
                              className="w-full inputs"
                            />
                            <CopyButton value={apiKey} toast={{ success: (text) => toast({ title: text })}} />
                          </div>
                        </Label>
                      </div>
                    )
                  })
                  mutate();
                }}
              />
            )}
            trigger={(
              <Button
                variant="surface"
                icon={<AddIcon size={ICON_SIZE} onClick={() => {
                  setNewKeyState({});
                }} />}
              />
            )}
          />
        )}
      />
      <Modal
        size="md"
        open={!!modalConfig}
        onOpenChange={() => setModalConfig(null)}
        title={modalConfig?.title ?? null}
        content={modalConfig?.content ?? null}
      />
      <ConfirmDeleteModal
        title="Delete API Key?"
        data={deleteModalConfig}
        onSuccess={async(_item) => {
          if (!_item?.id) return;
          const res = await fetch(process.env.PUBLIC_API_URL + `/v1/access/api-keys/${_item?.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res?.ok) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to delete API Key"
            });
            return;
          };
          toast({ title: "API Key deleted" });
          setDeleteModalConfig(null);
          setModalConfig(null);
          setNewKeyState({})
          mutate();
        }}
        onError={(_error) => {
          console.error(_error);
          toast({ variant: "destructive", title: "Error", description: _error?.message ?? '' });
        }}
        open={deleteModalConfig}
        onOpenChange={(_open) => _open === false && setDeleteModalConfig(null)}
      />
      { (!data || data?.length < 1) && <NoResultsFound type="API Keys" /> }
    </div>
  )
};
export default APIKeys;
