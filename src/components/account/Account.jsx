import { Label } from "@/components/fields/Label";
import { toast } from "@/components/Toast";
import { useRequest } from "@/hooks/use-request";

// TODO: reuse Indicator component
//import Indicator from "@/components/Indicator";

import { CheckIcon } from "@/components/Icons";

import {
  deleteAccount,
  updateAccount
} from "@/api/account";

//import { logout } from "@/api/auth";

import { StatusConstants, PlanConstants } from "@/constants";

const getStatusColorByValue = (value) => {
  if (value === StatusConstants.ACTIVE) return "bg-green-600";
  if (value === StatusConstants.INACTIVE) return "bg-red-500";
  if (value === StatusConstants.UNKNOWN) return "bg-yellow-500";
  return null;
};

const getPlanIconByValue = ({ value }) => {
  if (value === PlanConstants.FREE) return <CheckIcon size={16} />;
  if (value === PlanConstants.PRO) return <CheckIcon size={16} />;
  if (value === PlanConstants.FLEX) return <CheckIcon size={16} />;
  return <CheckIcon size={16} />;
};

const AccountField = ({ label, componentStart, value, componentEnd, link }) => {
  const id = `account-${label}`;
  return(
    <Label
      label={label}
      htmlFor={id}
    >
        <div className="flex items-center space-x-2 w-full inputs bg-neutral-100 dark:bg-neutral-800">
          { componentStart }
          <input
            id={id}
            type="text"
            readOnly
            className="inputs bg-neutral-100 dark:bg-neutral-800 border-0 focus:ring-0 w-full"
            value={value}
          />
          { componentEnd }
        </div>
        { link && (
          <a onClick={()=>link?.onClick ? link.onClick() : null} className="text-sm ms-auto">
            {link?.label ?? ''}
          </a>
        )}
      </Label>
  );
};

const mapStatus = (status) => {
  if (!status) return '';
  if (
    status === StatusConstants.ACTIVE ||
    status === StatusConstants.INACTIVE
  ) {
    return status;
  };
  return StatusConstants.UNKNOWN;
};

const Account = () => {
  const { data: account, error, mutate } = useRequest("/v1/account");

  if (error) {
    toast.error(error);
  };

  const onReactivateAccount = async() => {
    // TODO: notify admin rather than auto-reactivate
    const accountData = { ...account, status: StatusConstants.ACTIVE };
    await updateAccount({ accountData });
    mutate(); return;
  };

  const onDeactivateAccount = async() => {
    const accountData = { ...account, status: StatusConstants.INACTIVE };
    await updateAccount({ accountData });
    mutate(); return;
  };

  const onDeleteAccount = async() => {
    // TODO: prompt to confirm
    const { errors } = await deleteAccount();
    if (errors) {
      // toast.error(errors);
      console.error(errors);
      return;
    };
    // TODO: prompt to undo
    //logout();
    return;
  };

  const status = mapStatus(account?.status);

  return(
    <div className="w-full lg:w-[800px] flex flex-col space-y-8">
      <AccountField
        label="Email"
        value={account?.email ?? ''}
        /*
        link={{
          label: "Change Email Request",
          onClick: ()=>console.log("***CHANGE EMAIL REQUEST")
        }}
        */
      />
      <AccountField
        label="Plan"
        value={account?.plan?.toUpperCase() ?? ''}
        //componentEnd={getPlanIconByValue({ value: account?.plan })}
        link={{
          label: "Change Plan",
          onClick: ()=>console.log("***CHANGE PLAN")
        }}
      />
      <AccountField
        label="Status"
        value={status?.toUpperCase() ?? ''}
        componentEnd={<span className={`w-4 h-4 rounded-full ${getStatusColorByValue(status)}`}></span>}
        /*
        link={ status !== StatusConstants.ACTIVE ? {
          label: "Contact Support",
          onClick: ()=>console.log("***CONTACT SUPPORT")
        } : null}
        */
      />
      <div className="flex flex-row items-center justify-between pt-8">
        { status === StatusConstants.INACTIVE ? (
          <div className="ms-auto flex flex-col space-y-12">
            <a onClick={()=>onReactivateAccount()} className="font-bold ms-auto">
              Reactivate Account
            </a>
            <a onClick={()=>onDeleteAccount()} className="danger ms-auto">
              Delete Account
            </a>
          </div>
        ) : (
          <a onClick={() =>onDeactivateAccount()} className="danger ms-auto">
            Deactivate Account
          </a>
        )}
      </div>
    </div>
  );
};
export default Account;
