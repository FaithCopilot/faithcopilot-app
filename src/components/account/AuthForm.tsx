import { useEffect, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { toast } from "@/components/Toast";

import { useTranslations } from "@/hooks/use-i18n";

import { fetcher } from "@/services/fetch";

interface IFetchRedirect {
  unauthorized?: boolean;
  ok?: boolean;
}

interface IFetchMessages {
  unauthorized?: string;
  error?: string;
  ok?: string;
}

interface IFetchOptions {
  method?: string;
  headers?: {
    [key: string]: string;
  };
  body?: any;
  "x-redirect"?: IFetchRedirect;
}

const fetchAuth = async ({
  url,
  body,
  redirect,
  messages
}: {
  url: string;
  body?: any;
  redirect?: IFetchRedirect;
  messages?: IFetchMessages | null;
}) => {
  const options: IFetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  if (body) {
    options["body"] = JSON.stringify(body);
  }
  if (!redirect) {
    redirect = {
      unauthorized: false,
      ok: true
    };
  }
  // TODO: should this be with headers
  options["x-redirect"] = redirect;
  const res = await fetcher(url, options);
  if (res?.status === 401) {
    const unauthorizedMessage = messages?.unauthorized ?? "Unauthorized";
    //console.error(unauthorizedMessage);
    toast(unauthorizedMessage, { className: "toast-error" });
    return;
  }
  if (!res?.ok) {
    const errorMessage = messages?.error ?? "Something went wrong, try again later";
    //console.error(errorMessage);
    toast(errorMessage, { className: "toast-error" });
    return;
  }
  // we anticipate an error (stay on page), or a redirect (handled by fetcher)
  return;
};

const handleCredentialResponse = async (response: any) => {
  const token = response?.credential;
  if (!token) {
    return;
  }
  return await fetchAuth({
    url: "/v1/auth/token?grant_type=urn:ietf:params:oauth:grant-type:token-exchange&provider=google",
    body: { token },
    messages: {
      unauthorized: "Google sign-in failed",
      error: "Google sign-in failed"
    }
  });
};

export const AuthForm = ({
  brandName,
  login,
  signup,
  confirm,
  mfa,
  forgot,
  reset,
  googleClientId
}: {
  brandName?: string;
  login?: boolean;
  signup?: boolean;
  confirm?: boolean;
  mfa?: boolean;
  forgot?: boolean;
  reset?: boolean;
  googleClientId?: string;
}) => {
  const { t } = useTranslations();
  const [code, setCode] = useState<string|undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  const onSubmit = async () => {
    setLoading(true);
    let url = null;
    let messages = null;
    if (login) {
      url = "/v1/auth/token?grant_type=password";
      messages = {
        unauthorized: "Invalid email or password"
      };
    }
    if (signup) {
      if (data?.confirmPassword !== data?.password) {
        toast("Passwords do not match", { className: "toast-error" });
        return;
      };
      url = "/v1/auth/signup";
      messages = {
        unauthorized: "Email already exists",
      };
    }
    if (confirm) {
      url = "/v1/auth/confirm-email";
      messages = {
        unauthorized: "Invalid code"
      };
    }
    if (mfa) {
      url = "/v1/auth/mfa";
      messages = {
        unauthorized: "Invalid code"
      };
    }
    if (forgot) {
      url = "/v1/auth/forgot-password";
      messages = {
        ok: "You should receive an email shortly"
      };
    }
    if (reset) url = "/v1/auth/reset-password";
    /*
    if (reset) {
      if (!passwordCode) {
        // TODO: error toast
        toast("", { className: "toast-error" });
        return;
      };
      data["code"] = passwordCode;
      url = "/v1/auth/reset-password";
    };
    */
    if (url && data) {
      await fetchAuth({ url, body: data, messages });
      setLoading(false);
      return;
    }
    return;
  };

  const onResendCode = async () => {
    const url = "/v1/auth/resend-code";
    const redirect = {
      unauthorized: false,
      ok: false
    };
    return fetchAuth({ url, redirect });
  };

  useEffect(() => {
    const initializeGsi = () => {
      (window as any)?.google?.accounts?.id?.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse
      });
      (window as any)?.google?.accounts?.id?.renderButton(
        document.getElementById("continue-with-google"),
        {
          theme: "filled_blue",
          size: "large",
          text: "continue_with",
          width: 215,
          logo_alignment: "center"
        } // customization attributes
      );
      //(window as any)?.google?.accounts?.id?.prompt();
    };
    if (!googleClientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGsi;
    script.async = true;
    script.id = "google-client-script";
    document.querySelector("body")?.appendChild(script);
    return () => {
      (window as any)?.google?.accounts?.id?.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, [googleClientId]);

  useEffect(() => {
    if (confirm || reset) {
      const urlParams = new URLSearchParams(window.location.search);
      const _code = urlParams.get("code");
      if (_code) {
        setCode(_code);
      }
    }
    return;
  }, [code, confirm, reset]);

  const authLogin: string = t ? t("auth.login") : "Login";
  const authLoginQuestion: string = t
    ? t("auth.login.question")
    : "Already signed up?";
  const authEmail: string = t ? t("auth.email") : "Email";
  const authPassword: string = t ? t("auth.password") : "Password";
  const authConfirmPassword: string = t
    ? t("auth.confirmPassword")
    : "Confirm Password";
  const authContinueWithEmail: string = t
    ? t("auth.continueWithEmail")
    : "Continue with email";
  const authForgotPassword: string = t
    ? t("auth.forgotPassword")
    : "Forgot Password?";
  const authForgotPasswordInstructions: string = t
    ? t("auth.forgotPasswordInstructions")
    : "Enter your email address and we will send you a link to reset your password";
  const resetPassword: string = t ? t("auth.resetPassword") : "Reset Password";
  const authSignup: string = t ? t("auth.signup") : "Sign up";
  const authSignupQuestion: string = t
    ? t("auth.signup.question")
    : "Not yet signed up?";
  const authAcknowledgement1: string = t
    ? t("auth.acknowledgement.1")
    : "By continuing, you acknowledge that you have read and agree to our";
  const authAcknowledgementTos: string = t
    ? t("auth.acknowledgement.tos")
    : "Terms of Service";
  const authAcknowledgement2: string = t ? t("auth.acknowledgement.2") : "and";
  const authAcknowledgementPP: string = t
    ? t("auth.acknowledgement.pp")
    : "Privacy Policy";
  const authConfirmEmail: string = t ? t("auth.confirmEmail") : "Confirm Email";
  const authResendCode: string = t ? t("auth.resendCode") : "Resend Code";
  const authCode: string = t ? t("auth.code") : "Code";
  const authSubmit: string = t ? t("auth.submit") : "Submit";
  const authMFA: string = t ? t("auth.mfa") : "Multi-Factor Auth (MFA)";

  let headerText = "";
  if (login) headerText = authLogin;
  if (signup) headerText = authSignup;
  if (confirm) headerText = authConfirmEmail;
  if (forgot) headerText = authForgotPassword?.replace("?", "");
  if (reset) headerText = resetPassword;
  if (mfa) headerText = authMFA;

  let buttonText = authContinueWithEmail;
  if (confirm || mfa || forgot || reset) {
    buttonText = authSubmit;
  }
  return (
    <div className="flex flex-col space-y-4 align-items justify-center min-h-screen mx-auto mb-12 w-96">
      <span className="text-4xl font-bold mx-auto">{brandName}</span>
      <span className="text-2xl mx-auto pt-2 pb-4">{headerText}</span>
      <div className="pl-4 pr-6">
        <form
          onSubmit={onSubmit}
          className="flex flex-col space-y-2"
        >
          {googleClientId && (
            <div id="continue-with-google" className="mx-auto pb-4"></div>
          )}
          {googleClientId && (login || signup) && (
            <hr className="w-full max-w-xs h-px border-neutral-400 dark:border-neutral-700 pb-4" />
          )}
          {forgot && (
            <div className="pt-4">
              <span className="texts text-sm">
                {authForgotPasswordInstructions}
              </span>
            </div>
          )}
          {(confirm || mfa) && (
            <div className="pt-4">
              <label className="text-sm font-bold">
                {authCode}
                <input
                  required
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="inputs w-full max-w-xs"
                />
              </label>
            </div>
          )}
          {(login || signup || forgot) && (
            <div className="flex flex-col space-y-4">
              <label className="text-sm font-bold">
                {authEmail}
                <input
                  required
                  type="email"
                  value={data?.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="inputs w-full max-w-xs"
                />
              </label>
          {(login || signup || reset) && (
              <label className="text-sm font-bold">
                {authPassword}
                <input
                  type="password"
                  className="inputs w-full max-w-xs"
                  value={data?.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                />
              </label>
            )}
              {(signup || reset) && (
                <label className="text-sm font-bold">
                  {authConfirmPassword}
                  <input
                    type="password"
                    className="inputs w-full max-w-xs"
                    onChange={(e) =>
                      setData({ ...data, confirmPassword: e.target.value })
                    }
                    required
                  />
                </label>
              )}
              <Button 
                type="submit"
                disabled={loading}
                label={buttonText}
                className="w-full max-w-xs justify-center"
              />
              {login && (
                <div>
                  {/*
                  <div className="pt-4">
                    <a href="/forgot-password">{authForgotPassword}</a>
                  </div>
                  */}
                  <div className="placeholders pt-4">
                    {authSignupQuestion} <a href="/signup">{authSignup}</a>
                  </div>
                </div>
              )}
              {signup && (
                <div className="placeholders pt-4">
                  {authLoginQuestion} <a href="/login">{authLogin}</a>
                </div>
              )}
              <span className="placeholders text-sm">
                {authAcknowledgement1}{" "}
                <a href="/terms-of-service">{authAcknowledgementTos}</a>{" "}
                {authAcknowledgement2}{" "}
                <a href="/privacy-policy">{authAcknowledgementPP}</a>.
              </span>
            </div>
          )}
          {/*confirm && (
            <div className="pt-4">
              <span className="placeholders text-sm">
                <a onClick={() => onResendCode()}>{authResendCode}</a>
              </span>
            </div>
          )*/}
        </form>
      </div>
    </div>
  );
};
