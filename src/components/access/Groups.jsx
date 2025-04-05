import { useEffect, useState } from "react";
// TODO: refactor to useState
import { useForm } from "react-hook-form";

import { FilterTable } from "@/components/FilterTable";
import { Button } from "@/components/buttons/Button";
import { ButtonMenu } from "@/components/ButtonMenu";
import { DatePicker } from "@/components/DatePicker";
import { Label } from "@/components/fields/Label";
import { CopyButton } from "@/components/buttons/CopyButton";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Modal } from "@/components/modals/Modal";
import { Stepper } from "@/components/Stepper";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

// TODO: refactor to Icons
import {
  ChevronDownIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

const columnItems = [
  { accessor: "name", header: "Name", minSize: 200 },
  { accessor: "users", header: "Users", size: 25 },
  { accessor: "createdAt", header: "Created", size: 75 },
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
              iconStart={<PlusIcon />}
              className="w-24"
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
    <div>
      { stepperOpen && (
        <Stepper
          setStepperOpen={setStepperOpen}
          steps={[
            { component: NewAPIKeyModal1, props: { mutate }},
            { component: NewAPIKeyModal2 }
          ]}
        />
      )}
      <ButtonMenu
        variant="surface"
        items={[
          {
            icon: <PlusIcon />,
            label: "New Group",
            onClick: () => setStepperOpen(true)
          },
        ]}
        iconStart={<PlusIcon />}
        iconEnd={<ChevronDownIcon />}
        classNames={{
          button: "py-4 px-6"
        }}
      />
    </div>
  );
};

const Groups = () => {
  let { data, error, isLoading, mutate } = useRequest("/v1/data");
  data = [
    {
      name: "Admin",
      users: "4",
      createdAt: "2024-04-15T12:15:00Z",
    },
    {
      name: "Members",
      users: "12",
      createdAt: "2024-04-16T09:15:00Z",
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
    //return null;
  };
*/

  // TODO: handle error: "r is not a function"
  //const actionItems = [
  const actionItems = (item, idx) => [
    {
      icon: <Trash2Icon />,
      label: "Remove Group",
      onClick: () => console.log("*** REMOVE: ", item)
/*
      onClick: () => setSelectedAPIKeyData({
        ...item,
        confirmValue: item?.label
      }),
*/
    }
  ];

  if (Array.isArray(data) && data?.length > 0) {
    // map data json such that tags property is a joined string delimited by comma
    data?.forEach((item) => {
      if (Array.isArray(item?.tags)) {
        item.tags = item.tags?.join(", ");
      };
    });
  };

  return (
    <div>
      <FilterTable
        search
        columnItems={columnItems}
        data={data}
        initialState={{
          sorting: [
            {
              id: "lastModifiedAt",
              desc: true
            },
          ],
        }}
        actionItems={actionItems}
        componentEnd={(
          <NewAPIKeyButton mutate={mutate} />
        )}
/*
        componentEnd={(
          <ButtonMenu
            variant="surface"
            items={[
              {
                icon: <PlusIcon />,
                label: "New API Key",
                onClick: () => null
              },
            ]}
            iconStart={<PlusIcon />}
            iconEnd={<ChevronDownIcon />}
            classNames={{
              button: "py-4 px-6"
            }}
          />
        )}
*/
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
export default Groups;
