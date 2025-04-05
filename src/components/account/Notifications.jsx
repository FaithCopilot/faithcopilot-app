import { useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { UpdateButton } from "@/components/buttons/UpdateButton";
import { Checkbox } from "@/components/fields/Checkbox";
import { Label } from "@/components/fields/Label";
import { toast } from "@/components/Toast";
import { useRequest } from "@/hooks/use-request";

import { updateAccount } from "@/api/account";

const Notifications = () => {
  const [notifications, setNotifications] = useState(null);
  const { data: account, error, isLoading, mutate } = useRequest("/v1/account");

  if (error) {
    toast.error(error);
  };

  const register = () => {};
  const handleSubmit = (data) => onSubmit(data);
  const formState = { errors: {}, isDirty: false, isValid: true };

  const onSubmit = async(data) => {
    console.log("***DATA*** ", data)
    /*
    const accountData = { ...account, notifications: data };
    await updateAccount({ accountData });
    //mutate(); unnecessary bc checkbox preserves local state
    */
    toast("Settings updated");
    return;
  };

  return(
    <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[800px] flex flex-col space-y-8">
      <AccountSection
        title="Email"
        layout="col"
        className="flex flex-col space-y-8 pt-4"
      >
        <Label
          inline
          end
          label="Account*"
          subLabel="Be notified by email per account related information (*cannot opt-out)"
          htmlFor="email-account"
        >
          <Checkbox
            id="email-account"
            disabled
            readOnly
            checked
          />
        </Label>
        <Label
          inline
          end
          label="Alerts"
          subLabel="Be notified by email when an important event occurs"
          htmlFor="email-alerts"
        >
          <Checkbox
            id="email-alerts"
            //{...register("email.alerts")}
            register={register}
          />
        </Label>
        <Label
          inline
          end
          label="Product News and Promotions"
          subLabel="Learn about the latest products, promotions, and features as soon as they launch"
          htmlFor="email-product"
        >
          <Checkbox
            id="email-product"
            {...register("email.product")}
          />
        </Label>
      </AccountSection>
      <AccountSection
        title="In-App"
        layout="col"
        className="flex flex-col space-y-8 pt-4"
      >
        <Label
          inline
          end
          label="Alerts*"
          subLabel="Be notified in-app when an important event occurs (*cannot opt-out)"
          htmlFor="inapp-alerts"
        >
          <Checkbox
            id="inapp-alerts"
            disabled
            readOnly
            checked
          />
        </Label>
        <Label
          inline
          end
          label="Analytics"
          subLabel="Gain visibility into your account with in-depth analytics"
          htmlFor="inapp-analytics"
        >
          <Checkbox
            id="inapp-analytics"
            {...register("inapp.analytics")}
          />
        </Label>
        {/*
        <Label
          inline
          end
          label="Organization Activity"
          subLabel="Receive updates on your organization and team members' activity"
          htmlFor="inapp-organization"
        >
          <Checkbox
            id="inapp-organization"
            {...register("inapp.organization")}
            disabled
          />
        </Label>
        */}
      </AccountSection>
      <UpdateButton disabled={!isDirty} />
    </form>
  );
};
export default Notifications;
