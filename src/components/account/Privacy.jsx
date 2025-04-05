import { useEffect, useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { Label } from "@/components/fields/Label";
import { UpdateButton } from "@/components/buttons/UpdateButton";
import { Switch } from "@/components/fields/Switch";
import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

import { updateAccount } from "@/api/account";

const Privacy = () => {
  const { data: account, error, isLoading, mutate } = useRequest("/v1/account");

  const [isDirty, setIsDirty] = useState(true);
  const [data, setData] = useState(account?.privacy ?? {
    cookies: {
      essential: true,
      marketing: false,
      performance: false
    }
  });

  useEffect(() => {
    if (account?.privacy) {
      setData(account.privacy);
    };
  }, [account?.privacy]);

  if (error) {
    //toast.error(error);
    toast({ title: "Error", description: error });
  };

  /*
  const { register, handleSubmit, setValue, formState } = useForm({
    values: account?.privacy
  });
  const { errors, isDirty } = formState;
  */

  //const onSubmit = async(data) => {
  const onSubmit = async() => {
    //toast("Settings updated");
    toast({ description: "Settings updated" });
    const accountData = { ...account, privacy: data };
    await updateAccount({ accountData, mutate });
    return;
  };

    //<form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-1/2 flex flex-col space-y-8">
  return(
    <form
      onSubmit={(evt) => {
        evt.preventDefault(); 
        onSubmit(evt);
      }}
      className="w-full md:w-1/2 flex flex-col space-y-8"
    >
      <AccountSection
        title="Cookies"
        layout="col"
        className="flex flex-col space-y-8 pt-4"
      >
        <Label
          inline
          end
          label="Functional*"
          subLabel="Only strictly necessary (*cannot opt-out)"
          htmlFor="cookies.essential"
        >
          <Switch
            id="cookies.essential"
            disabled
            checked 
            readOnly
          />
        </Label>
        <Label
          inline
          end
          label="Marketing"
          htmlFor="cookies.marketing"
        >
          <Switch
            //disabled
            id="cookies.marketing"
            //register={register}
            checked={data?.cookies?.marketing}
            onChange={(evt) => setData({ ...data, cookies: { ...data.cookies, marketing: evt.target.checked } })}
          />
        </Label>
        <Label
          inline
          end
          label="Performance"
          htmlFor="cookies.performance"
        >
          <Switch
            id="cookies.performance"
            //register={register}
            checked={data?.cookies?.performance}
            onChange={(evt) => setData({ ...data, cookies: { ...data.cookies, performance: evt.target.checked } })}
          />
        </Label>
      </AccountSection>
      <UpdateButton disabled={!isDirty} />
    </form>
  );
};
export default Privacy;
