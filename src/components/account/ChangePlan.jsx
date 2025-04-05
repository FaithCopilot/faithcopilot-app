import { updateAccount } from "@/api/account";

import { useRequest } from "@/hooks/use-request";

const ChangePlan = () => {
  const { account, error, isLoading, mutate } = useRequest("/v1/account");
  // TODO: handle error and loading states

  const onSubmit = async(data) => {
    const accountData = { ...account, notifications: data };
    await updateAccount({ accountData, mutate });
    return;
  };

  return(
    <div>ok</div>
  );
};
export default ChangePlan;
