import { useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { Modal } from "@/components/modals/Modal";
import { Switch } from "@/components/fields/Switch";

/*
const EnableMFAModal = ({ mfaEnabled }) => {
  const [code, setCode] = useState("");
  return(
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Enable Multi-Factor Auth (MFA)
        </DialogTitle>
        <DialogDescription>
          { mfaEnabled ?
            "Scan the following QR code with your authenticator app and proceed to enter a valid code to enable MFA" :
            "Enter a valid code from your authenticator app to disable MFA"
          }
        </DialogDescription>
      </DialogHeader>
      { mfaEnabled && (
        <div className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53" shapeRendering="crispEdges"><path fill="#ffffff" d="M0 0h53v53H0z"/><path stroke="#000000" d="M4 4.5h7m3 0h3m4 0h1m1 0h1m3 0h1m1 0h2m3 0h1m2 0h1m2 0h1m1 0h7M4 5.5h1m5 0h1m3 0h1m6 0h8m1 0h2m5 0h1m1 0h1m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h2m1 0h3m2 0h1m1 0h1m2 0h4m3 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h3m4 0h2m2 0h4m1 0h1m4 0h2m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m3 0h1m2 0h5m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m6 0h1m1 0h1m2 0h1m3 0h3m1 0h1m2 0h2m5 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m5 0h1m1 0h1m2 0h2m3 0h2m1 0h2m1 0h1m1 0h1m1 0h3M4 12.5h1m1 0h5m2 0h3m2 0h2m1 0h1m1 0h6m1 0h1m3 0h1m3 0h1m1 0h1m1 0h5M4 13.5h2m2 0h1m2 0h1m1 0h1m6 0h1m1 0h1m4 0h3m1 0h2m2 0h3m3 0h1m3 0h4M4 14.5h2m4 0h1m1 0h2m1 0h1m1 0h2m1 0h1m2 0h1m1 0h2m2 0h2m2 0h1m2 0h3m1 0h3m2 0h3M5 15.5h2m4 0h1m3 0h1m1 0h1m7 0h1m1 0h3m2 0h1m2 0h2m1 0h1m1 0h1m1 0h1m3 0h3M4 16.5h1m4 0h2m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m6 0h4m1 0h2M4 17.5h3m1 0h1m2 0h1m1 0h1m1 0h1m2 0h1m2 0h1m3 0h3m1 0h1m4 0h4m1 0h2m2 0h1m2 0h2M4 18.5h5m1 0h1m2 0h1m1 0h2m2 0h1m2 0h4m4 0h5m3 0h2m2 0h2m1 0h1m2 0h1M4 19.5h2m1 0h3m3 0h6m1 0h1m4 0h1m2 0h1m3 0h2m1 0h3m1 0h1m1 0h1m1 0h4m1 0h1M4 20.5h1m5 0h1m2 0h3m1 0h7m1 0h1m2 0h1m1 0h4m1 0h1m1 0h2m2 0h1m5 0h1M4 21.5h1m4 0h1m1 0h3m3 0h1m3 0h1m2 0h1m2 0h2m2 0h4m2 0h2m1 0h2m1 0h3m1 0h2M4 22.5h1m3 0h1m1 0h1m5 0h1m1 0h1m1 0h1m3 0h2m1 0h3m1 0h2m1 0h2m1 0h1m3 0h3m3 0h1M4 23.5h1m4 0h1m1 0h2m1 0h3m2 0h2m2 0h1m3 0h3m1 0h5m1 0h1m4 0h1m1 0h1m3 0h1M5 24.5h8m2 0h1m1 0h4m1 0h1m1 0h7m2 0h2m1 0h1m1 0h7m2 0h1M6 25.5h3m3 0h1m1 0h2m2 0h2m1 0h1m2 0h1m3 0h1m1 0h6m1 0h4m3 0h3m1 0h1M4 26.5h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h4m1 0h3m1 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1M4 27.5h3m1 0h1m3 0h1m1 0h3m3 0h3m1 0h1m3 0h1m1 0h6m2 0h1m1 0h1m3 0h3m1 0h1M7 28.5h6m1 0h3m3 0h1m1 0h8m6 0h1m1 0h1m1 0h6m2 0h1M7 29.5h2m2 0h1m2 0h2m5 0h6m2 0h1m5 0h1m3 0h2m4 0h2m1 0h1M4 30.5h3m1 0h3m2 0h1m2 0h5m1 0h1m6 0h1m5 0h1m2 0h1m1 0h1m1 0h3m1 0h2M7 31.5h3m1 0h3m2 0h1m1 0h1m4 0h1m3 0h3m2 0h1m1 0h3m1 0h4m1 0h2m1 0h2M4 32.5h1m1 0h1m1 0h1m1 0h3m1 0h5m2 0h1m5 0h2m1 0h4m1 0h1m2 0h1m2 0h1m2 0h2m1 0h1M4 33.5h2m1 0h1m1 0h1m2 0h1m1 0h2m1 0h3m1 0h1m2 0h6m1 0h2m1 0h3m8 0h4M4 34.5h1m1 0h3m1 0h3m5 0h1m3 0h2m1 0h1m1 0h2m1 0h2m1 0h1m3 0h5m3 0h2M4 35.5h2m2 0h2m1 0h1m1 0h3m3 0h1m1 0h4m1 0h1m5 0h5m1 0h2m2 0h2m1 0h2M5 36.5h2m2 0h2m3 0h1m2 0h1m2 0h1m1 0h5m2 0h1m2 0h1m2 0h1m1 0h1m3 0h4m2 0h1M8 37.5h2m2 0h2m1 0h1m1 0h2m3 0h2m2 0h2m3 0h1m1 0h8m1 0h2m4 0h1M8 38.5h1m1 0h2m3 0h3m1 0h3m1 0h3m1 0h1m1 0h1m5 0h2m4 0h1m1 0h1m1 0h2M5 39.5h4m2 0h1m4 0h1m3 0h1m1 0h4m2 0h1m2 0h1m2 0h3m2 0h2m1 0h1m4 0h2M4 40.5h1m2 0h2m1 0h1m4 0h2m1 0h2m2 0h1m1 0h5m1 0h1m6 0h1m2 0h5M12 41.5h2m1 0h1m1 0h4m2 0h2m3 0h1m5 0h1m1 0h3m1 0h1m3 0h1m1 0h3M4 42.5h7m3 0h2m1 0h1m2 0h2m1 0h2m1 0h1m1 0h2m2 0h2m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2M4 43.5h1m5 0h1m1 0h2m2 0h6m1 0h2m3 0h2m2 0h5m3 0h1m3 0h3m1 0h1M4 44.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h4m1 0h5m1 0h1m5 0h2m1 0h6m3 0h1M4 45.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m4 0h4m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1M4 46.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h2m5 0h1m2 0h1m1 0h1m1 0h1m3 0h3m1 0h1m5 0h2M4 47.5h1m5 0h1m3 0h2m1 0h1m2 0h1m2 0h2m1 0h2m1 0h1m2 0h1m2 0h5m4 0h3M4 48.5h7m1 0h2m1 0h2m1 0h2m3 0h1m2 0h3m1 0h2m2 0h2m4 0h4m1 0h1m1 0h1"/></svg>
        </div>
      )}
      <Label
        htmlFor="label"
        label="Code"
      >
        <input
          disabled
          id="label"
          type="text"
          value={code}
          onChange={evt => setCode(evt.target.value)}
          className="w-full inputs"
        />
      </Label>
      <IconButton
        type="submit"
        //icon="check"
        label="Submit"
      />
    </DialogContent>
  );
};
*/

const Security = () => {
  const [mfaEnabled, setMFAEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");

  /*
  useEffect(()=>{
    fetch("/api/mfa")
      .then(res => res.json())
      .then(data => {
        setMFAEnabled(data.enabled);
      });
    return;
  }, []);
  */

  return(
    <AccountSection
      title="Multi-Factor Authentication (MFA)"
      layout="col"
      className="flex flex-col space-y-8 pt-4"
    >
      <Switch
        id="mfa"
        checked={mfaEnabled}
        onChange={(evt) => setShowModal(true)}
      />
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title={`${ mfaEnabled ? "Disable" : "Enable" } Multi-Factor Auth (MFA)`}
        description={ mfaEnabled ?
          "Enter a valid code from your authenticator app to disable MFA" :
          "Scan the following QR code with your authenticator app and proceed to enter a valid code to enable MFA"
        }
        content={(
          <div className="flex flex-col space-y-4">
            { !mfaEnabled && (
              <div className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53" shapeRendering="crispEdges"><path fill="#ffffff" d="M0 0h53v53H0z"/><path stroke="#000000" d="M4 4.5h7m3 0h3m4 0h1m1 0h1m3 0h1m1 0h2m3 0h1m2 0h1m2 0h1m1 0h7M4 5.5h1m5 0h1m3 0h1m6 0h8m1 0h2m5 0h1m1 0h1m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h2m1 0h3m2 0h1m1 0h1m2 0h4m3 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h3m4 0h2m2 0h4m1 0h1m4 0h2m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m3 0h1m2 0h5m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m6 0h1m1 0h1m2 0h1m3 0h3m1 0h1m2 0h2m5 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m5 0h1m1 0h1m2 0h2m3 0h2m1 0h2m1 0h1m1 0h1m1 0h3M4 12.5h1m1 0h5m2 0h3m2 0h2m1 0h1m1 0h6m1 0h1m3 0h1m3 0h1m1 0h1m1 0h5M4 13.5h2m2 0h1m2 0h1m1 0h1m6 0h1m1 0h1m4 0h3m1 0h2m2 0h3m3 0h1m3 0h4M4 14.5h2m4 0h1m1 0h2m1 0h1m1 0h2m1 0h1m2 0h1m1 0h2m2 0h2m2 0h1m2 0h3m1 0h3m2 0h3M5 15.5h2m4 0h1m3 0h1m1 0h1m7 0h1m1 0h3m2 0h1m2 0h2m1 0h1m1 0h1m1 0h1m3 0h3M4 16.5h1m4 0h2m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m6 0h4m1 0h2M4 17.5h3m1 0h1m2 0h1m1 0h1m1 0h1m2 0h1m2 0h1m3 0h3m1 0h1m4 0h4m1 0h2m2 0h1m2 0h2M4 18.5h5m1 0h1m2 0h1m1 0h2m2 0h1m2 0h4m4 0h5m3 0h2m2 0h2m1 0h1m2 0h1M4 19.5h2m1 0h3m3 0h6m1 0h1m4 0h1m2 0h1m3 0h2m1 0h3m1 0h1m1 0h1m1 0h4m1 0h1M4 20.5h1m5 0h1m2 0h3m1 0h7m1 0h1m2 0h1m1 0h4m1 0h1m1 0h2m2 0h1m5 0h1M4 21.5h1m4 0h1m1 0h3m3 0h1m3 0h1m2 0h1m2 0h2m2 0h4m2 0h2m1 0h2m1 0h3m1 0h2M4 22.5h1m3 0h1m1 0h1m5 0h1m1 0h1m1 0h1m3 0h2m1 0h3m1 0h2m1 0h2m1 0h1m3 0h3m3 0h1M4 23.5h1m4 0h1m1 0h2m1 0h3m2 0h2m2 0h1m3 0h3m1 0h5m1 0h1m4 0h1m1 0h1m3 0h1M5 24.5h8m2 0h1m1 0h4m1 0h1m1 0h7m2 0h2m1 0h1m1 0h7m2 0h1M6 25.5h3m3 0h1m1 0h2m2 0h2m1 0h1m2 0h1m3 0h1m1 0h6m1 0h4m3 0h3m1 0h1M4 26.5h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h4m1 0h3m1 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1M4 27.5h3m1 0h1m3 0h1m1 0h3m3 0h3m1 0h1m3 0h1m1 0h6m2 0h1m1 0h1m3 0h3m1 0h1M7 28.5h6m1 0h3m3 0h1m1 0h8m6 0h1m1 0h1m1 0h6m2 0h1M7 29.5h2m2 0h1m2 0h2m5 0h6m2 0h1m5 0h1m3 0h2m4 0h2m1 0h1M4 30.5h3m1 0h3m2 0h1m2 0h5m1 0h1m6 0h1m5 0h1m2 0h1m1 0h1m1 0h3m1 0h2M7 31.5h3m1 0h3m2 0h1m1 0h1m4 0h1m3 0h3m2 0h1m1 0h3m1 0h4m1 0h2m1 0h2M4 32.5h1m1 0h1m1 0h1m1 0h3m1 0h5m2 0h1m5 0h2m1 0h4m1 0h1m2 0h1m2 0h1m2 0h2m1 0h1M4 33.5h2m1 0h1m1 0h1m2 0h1m1 0h2m1 0h3m1 0h1m2 0h6m1 0h2m1 0h3m8 0h4M4 34.5h1m1 0h3m1 0h3m5 0h1m3 0h2m1 0h1m1 0h2m1 0h2m1 0h1m3 0h5m3 0h2M4 35.5h2m2 0h2m1 0h1m1 0h3m3 0h1m1 0h4m1 0h1m5 0h5m1 0h2m2 0h2m1 0h2M5 36.5h2m2 0h2m3 0h1m2 0h1m2 0h1m1 0h5m2 0h1m2 0h1m2 0h1m1 0h1m3 0h4m2 0h1M8 37.5h2m2 0h2m1 0h1m1 0h2m3 0h2m2 0h2m3 0h1m1 0h8m1 0h2m4 0h1M8 38.5h1m1 0h2m3 0h3m1 0h3m1 0h3m1 0h1m1 0h1m5 0h2m4 0h1m1 0h1m1 0h2M5 39.5h4m2 0h1m4 0h1m3 0h1m1 0h4m2 0h1m2 0h1m2 0h3m2 0h2m1 0h1m4 0h2M4 40.5h1m2 0h2m1 0h1m4 0h2m1 0h2m2 0h1m1 0h5m1 0h1m6 0h1m2 0h5M12 41.5h2m1 0h1m1 0h4m2 0h2m3 0h1m5 0h1m1 0h3m1 0h1m3 0h1m1 0h3M4 42.5h7m3 0h2m1 0h1m2 0h2m1 0h2m1 0h1m1 0h2m2 0h2m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2M4 43.5h1m5 0h1m1 0h2m2 0h6m1 0h2m3 0h2m2 0h5m3 0h1m3 0h3m1 0h1M4 44.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h4m1 0h5m1 0h1m5 0h2m1 0h6m3 0h1M4 45.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m4 0h4m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1M4 46.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h2m5 0h1m2 0h1m1 0h1m1 0h1m3 0h3m1 0h1m5 0h2M4 47.5h1m5 0h1m3 0h2m1 0h1m2 0h1m2 0h2m1 0h2m1 0h1m2 0h1m2 0h5m4 0h3M4 48.5h7m1 0h2m1 0h2m1 0h2m3 0h1m2 0h3m1 0h2m2 0h2m4 0h4m1 0h1m1 0h1"/></svg>
              </div>
            )}
            <Label
              htmlFor="label"
              label="Code"
            >
              <input
                //disabled
                id="label"
                type="text"
                value={code}
                onChange={evt => setCode(evt.target.value)}
                className="w-full inputs"
              />
            </Label>
          </div>
        )}
        cancel
        footer={(
          <Button
            variant={ mfaEnabled ? "danger" : "primary" }
            type="button"
            label={ mfaEnabled ? "Disable" : "Enable" }
            onClick={() => {
              //console.log("*** mfaEnabled: ", mfaEnabled);
              //console.log("*** CODE TO VERIFY: ", code);
              setShowModal(false);
              setMFAEnabled(!mfaEnabled);
            }}
          />
        )}
      />
    </AccountSection>
  );
  /*
  return(
    <>
      { showQRCodeModal && (
        <ResponsiveModal
          lg 
          title={' '}
          dismiss={()=>setShowQRCodeModal(null)}
        >
          <div className="h-72 w-72">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53" shapeRendering="crispEdges"><path fill="#ffffff" d="M0 0h53v53H0z"/><path stroke="#000000" d="M4 4.5h7m3 0h3m4 0h1m1 0h1m3 0h1m1 0h2m3 0h1m2 0h1m2 0h1m1 0h7M4 5.5h1m5 0h1m3 0h1m6 0h8m1 0h2m5 0h1m1 0h1m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h2m1 0h3m2 0h1m1 0h1m2 0h4m3 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h3m4 0h2m2 0h4m1 0h1m4 0h2m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m3 0h1m2 0h5m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m6 0h1m1 0h1m2 0h1m3 0h3m1 0h1m2 0h2m5 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m5 0h1m1 0h1m2 0h2m3 0h2m1 0h2m1 0h1m1 0h1m1 0h3M4 12.5h1m1 0h5m2 0h3m2 0h2m1 0h1m1 0h6m1 0h1m3 0h1m3 0h1m1 0h1m1 0h5M4 13.5h2m2 0h1m2 0h1m1 0h1m6 0h1m1 0h1m4 0h3m1 0h2m2 0h3m3 0h1m3 0h4M4 14.5h2m4 0h1m1 0h2m1 0h1m1 0h2m1 0h1m2 0h1m1 0h2m2 0h2m2 0h1m2 0h3m1 0h3m2 0h3M5 15.5h2m4 0h1m3 0h1m1 0h1m7 0h1m1 0h3m2 0h1m2 0h2m1 0h1m1 0h1m1 0h1m3 0h3M4 16.5h1m4 0h2m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m6 0h4m1 0h2M4 17.5h3m1 0h1m2 0h1m1 0h1m1 0h1m2 0h1m2 0h1m3 0h3m1 0h1m4 0h4m1 0h2m2 0h1m2 0h2M4 18.5h5m1 0h1m2 0h1m1 0h2m2 0h1m2 0h4m4 0h5m3 0h2m2 0h2m1 0h1m2 0h1M4 19.5h2m1 0h3m3 0h6m1 0h1m4 0h1m2 0h1m3 0h2m1 0h3m1 0h1m1 0h1m1 0h4m1 0h1M4 20.5h1m5 0h1m2 0h3m1 0h7m1 0h1m2 0h1m1 0h4m1 0h1m1 0h2m2 0h1m5 0h1M4 21.5h1m4 0h1m1 0h3m3 0h1m3 0h1m2 0h1m2 0h2m2 0h4m2 0h2m1 0h2m1 0h3m1 0h2M4 22.5h1m3 0h1m1 0h1m5 0h1m1 0h1m1 0h1m3 0h2m1 0h3m1 0h2m1 0h2m1 0h1m3 0h3m3 0h1M4 23.5h1m4 0h1m1 0h2m1 0h3m2 0h2m2 0h1m3 0h3m1 0h5m1 0h1m4 0h1m1 0h1m3 0h1M5 24.5h8m2 0h1m1 0h4m1 0h1m1 0h7m2 0h2m1 0h1m1 0h7m2 0h1M6 25.5h3m3 0h1m1 0h2m2 0h2m1 0h1m2 0h1m3 0h1m1 0h6m1 0h4m3 0h3m1 0h1M4 26.5h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h4m1 0h3m1 0h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1M4 27.5h3m1 0h1m3 0h1m1 0h3m3 0h3m1 0h1m3 0h1m1 0h6m2 0h1m1 0h1m3 0h3m1 0h1M7 28.5h6m1 0h3m3 0h1m1 0h8m6 0h1m1 0h1m1 0h6m2 0h1M7 29.5h2m2 0h1m2 0h2m5 0h6m2 0h1m5 0h1m3 0h2m4 0h2m1 0h1M4 30.5h3m1 0h3m2 0h1m2 0h5m1 0h1m6 0h1m5 0h1m2 0h1m1 0h1m1 0h3m1 0h2M7 31.5h3m1 0h3m2 0h1m1 0h1m4 0h1m3 0h3m2 0h1m1 0h3m1 0h4m1 0h2m1 0h2M4 32.5h1m1 0h1m1 0h1m1 0h3m1 0h5m2 0h1m5 0h2m1 0h4m1 0h1m2 0h1m2 0h1m2 0h2m1 0h1M4 33.5h2m1 0h1m1 0h1m2 0h1m1 0h2m1 0h3m1 0h1m2 0h6m1 0h2m1 0h3m8 0h4M4 34.5h1m1 0h3m1 0h3m5 0h1m3 0h2m1 0h1m1 0h2m1 0h2m1 0h1m3 0h5m3 0h2M4 35.5h2m2 0h2m1 0h1m1 0h3m3 0h1m1 0h4m1 0h1m5 0h5m1 0h2m2 0h2m1 0h2M5 36.5h2m2 0h2m3 0h1m2 0h1m2 0h1m1 0h5m2 0h1m2 0h1m2 0h1m1 0h1m3 0h4m2 0h1M8 37.5h2m2 0h2m1 0h1m1 0h2m3 0h2m2 0h2m3 0h1m1 0h8m1 0h2m4 0h1M8 38.5h1m1 0h2m3 0h3m1 0h3m1 0h3m1 0h1m1 0h1m5 0h2m4 0h1m1 0h1m1 0h2M5 39.5h4m2 0h1m4 0h1m3 0h1m1 0h4m2 0h1m2 0h1m2 0h3m2 0h2m1 0h1m4 0h2M4 40.5h1m2 0h2m1 0h1m4 0h2m1 0h2m2 0h1m1 0h5m1 0h1m6 0h1m2 0h5M12 41.5h2m1 0h1m1 0h4m2 0h2m3 0h1m5 0h1m1 0h3m1 0h1m3 0h1m1 0h3M4 42.5h7m3 0h2m1 0h1m2 0h2m1 0h2m1 0h1m1 0h2m2 0h2m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2M4 43.5h1m5 0h1m1 0h2m2 0h6m1 0h2m3 0h2m2 0h5m3 0h1m3 0h3m1 0h1M4 44.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h4m1 0h5m1 0h1m5 0h2m1 0h6m3 0h1M4 45.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m4 0h4m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1M4 46.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h2m5 0h1m2 0h1m1 0h1m1 0h1m3 0h3m1 0h1m5 0h2M4 47.5h1m5 0h1m3 0h2m1 0h1m2 0h1m2 0h2m1 0h2m1 0h1m2 0h1m2 0h5m4 0h3M4 48.5h7m1 0h2m1 0h2m1 0h2m3 0h1m2 0h3m1 0h2m2 0h2m4 0h4m1 0h1m1 0h1"/></svg>
          </div>
        </ResponsiveModal>
      )}
      <button onClick={()=>setShowQRCodeModal(true)}>Show QR Code</button>
    </>
  );
  */
};
export default Security;
