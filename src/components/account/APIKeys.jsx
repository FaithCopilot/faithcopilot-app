import { useEffect, useState } from "react";
// TODO: refactor to useState
import { useForm } from "react-hook-form";

//import { formatISO, set } from "date-fns";

import { FilterTable } from "@/components/FilterTable";
import { Button } from "@/components/buttons/Button";
import { DatePicker } from "@/components/DatePicker";
import { Label } from "@/components/fields/Label";
import { CopyButton } from "@/components/buttons/CopyButton";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Modal } from "@/components/modals/Modal";
import { Stepper } from "@/components/Stepper";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import { ICON_SIZE, AddIcon, DeleteIcon } from "@/components/Icons";

import { createAPIKey, deleteAPIKey } from "@/api/account";

import { getEndOfDayUTC, truncate } from "@/utils";

const columnItems = [
  { accessor: "sk", header: "Secret Key", size: 75 },
  { accessor: "label", header: "Label", minSize: 200 },
  { accessor: "iss", header: "Issued Date", size: 75 },
  { accessor: "exp", header: "Expiration Date", size: 75 },
];

const NewAPIKeyModal2 = ({ data, setStepperOpen }) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!open) {
      setStepperOpen(false);
    };
    return;
  }, [open]);
  const apiKey = data?.apiKey;
  if (!apiKey) {
    toast.error("Something went wrong. Please try again later.");
    setStepperOpen(false);
    return null;
  };
  const onOpenChange = (open) => {
    if (!open) {
      setStepperOpen(false);
      return;
    };
    setOpen(open);
  };
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New API Key"
      description="Copy the API key below and store it in a safe place. You will not be able to see it again!"
      content={(
        <Label
          htmlFor="label"
          label="API Key"
        >
          <div className="flex flex-row space-x-2 items-center">
            <input
              disabled
              id="label"
              type="text"
              value={apiKey}
              className="w-full inputs"
            />
            <CopyButton value={apiKey} toast={toast} />
          </div>
        </Label>
      )}
    />
  );
};

const NewAPIKeyModal1 = ({ onNext, setStepperOpen, mutate }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      setStepperOpen(false);
    };
    return;
  }, [open]);

  const onSubmit = async(reqData) => {
    reqData["exp"] = getEndOfDayUTC(reqData?.exp).toISOString();
    const { data: resData, error } = await createAPIKey(reqData);
    if (error) {
      toast.error(error);
    };
    if (resData?.key) {
      mutate();
      onNext({ apiKey: resData.key });
    };
    return;
  };

  const [zzclicked, setZZClicked] = useState(false);

  return(
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="New API Key"
      description="Specify a 'label' and 'expiration date' for this new API key. You may revoke an API Key at any time."
      content={(
        <div className="flex flex-row space-x-2 items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 mt-2 mb-6">
          <Label
            htmlFor="label"
            label="Label"
          >
            <input
              id="label"
              {...register("label", { required: true })}
              type="text"
              placeholder="My API Key"
              className="w-full inputs"
            />
          </Label>
          <Label
            htmlFor="expirationDate"
            label="Expiration Date"
          >
            <DatePicker
              mode="single"
              value={new Date()}
              onChange={(date) => setValue("exp", date)}
            />
          </Label>
          <div className="flex flex-row justify-end space-x-4">
            <Button
              variant="link"
              type="button"
              label="Cancel"
              onClick={() => setStepperOpen(false)}
              className="w-24"
            />
            <Button
              variant="primary"
              type="submit"
              label="Add"
              iconStart={<AddIcon size={ICON_SIZE} />}
            />
            <Button
              variant="outline"
              type="button"
              label="ZZ"
              onClick={() => setZZClicked(!zzclicked)}
              className="w-24"
            />
          </div>
        </form>
        {zzclicked && (
          <div className="w-full h-[1200px] dark:bg-green-800">
            fjdsklf
          </div>
        )}
        </div>
      )}
      className={
        zzclicked ?
          "overflow-y-auto h-full max-h-[calc(75%-20px)] max-w-[calc(75%-20px)]" :
          ''
        }
    />
  );
};

const NewAPIKeyButton = ({ mutate }) => {
  const [stepperOpen, setStepperOpen] = useState(false);
  // TODO: pass mutate
  return(
    <div className="mb-12">
      { stepperOpen && (
        <Stepper
          setStepperOpen={setStepperOpen}
          steps={[
            { component: NewAPIKeyModal1, props: { mutate }},
            { component: NewAPIKeyModal2 }
          ]}
        />
      )}
      <Button
        //variant="outline"
        label="New API Key"
        iconStart={<AddIcon size={ICON_SIZE} />}
        onClick={() => setStepperOpen(true)}
      />
    </div>
  );
};

const APIKeys = () => {
  const [selectedAPIKeyData, setSelectedAPIKeyData] = useState();
  let { data, error, isLoading, mutate } = useRequest("/v1/account/api-keys");
  data = data?.map((item) => {
    if (item?.exp) {
      item["exp"] = item?.exp?.split('T')[0];
    };
    if (item?.iss) {
      item["iss"] = item?.iss?.split('T')[0];
    };
    return item;
  });
  if (error) {
    toast.error(error.message);
    return null;
  };

  const actionItems = (item, idx) => [
    {
      icon: <DeleteIcon size={ICON_SIZE} />,
      label: "Revoke API Key",
      onClick: () => setSelectedAPIKeyData({
        ...item,
        confirmValue: item?.label
      }),
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      <FilterTable
        variant="none"
        columnItems={columnItems}
        data={data}
        initialState={{
          sorting: [
            {
              id: "iss",
              desc: true
            },
          ],
        }}
        actionItems={actionItems}
        componentEnd={<NewAPIKeyButton mutate={mutate} />}
      />
      <ConfirmDeleteModal
        title="Revoke API Key"
        data={selectedAPIKeyData}
        onSuccess={async(data) => {
          const { error } = await deleteAPIKey({ id: data?.id });
          if (error) {
            toast.error(error);
          };
          mutate();
          toast("API Key revoked")
          setSelectedAPIKeyData(null);
        }}
        onError={(error) => {
          console.error(error);
          toast.error(error);
        }}
        open={selectedAPIKeyData}
        onOpenChange={(open) => open === false && setSelectedAPIKeyData(null)}
      />
    </div>
  );
};
export default APIKeys;
