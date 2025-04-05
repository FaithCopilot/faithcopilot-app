import { useState } from "react";

import { Button } from "@/components/buttons/Button";

export const MigrationTokenModalContent = () => {
  const [token, setToken] = useState('');
  const onClick = () => console.log('*** TOKEN: ', token);
  return(
    <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="inputs"
        />
      <div className="ms-auto">
        <Button
          onClick={onClick}
          label="Submit"
        />
      </div>
    </div>
  );
};
