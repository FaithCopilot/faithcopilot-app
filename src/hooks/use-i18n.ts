import { useEffect, useState } from "react";

const DEFAULT_LANG = "en";

type LanguagesType = {
  label: string;
  value: string;
};

type DictionaryTermType = {
  [key: string]: string;
};

type DictionaryType = {
  [key: string]: DictionaryTermType;
};

export const useTranslations = ({
  dictionary
}: { dictionary?: DictionaryType } = {}) => {
  if (!dictionary) dictionary = {};
  const mergedDictionary = { ...DictionaryConstants, ...dictionary };
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const _lang = document?.documentElement?.lang ?? DEFAULT_LANG;
      if (_lang !== lang) {
        setLang(_lang);
        return;
      }
    }
    setLang(DEFAULT_LANG);
    return;
  }, []);
  return {
    t: (key: string) =>
      mergedDictionary?.[lang]?.[key] ??
      mergedDictionary?.[DEFAULT_LANG]?.[key] ??
      ""
  };
};

/*
export const t = ({ lang, key }: { lang: string; key: string }): string => {
  return (
    DictionaryConstants?.[lang]?.[key] ??
    DictionaryConstants?.[DEFAULT_LANG]?.[key] ??
    ""
  );
};
*/

export const getAvailableLanguages = ({ dictionary }: DictionaryType): any =>
  LanguageConstants.filter(({ _, value }: DictionaryTermType) =>
    Object.keys(dictionary).includes(value)
  );

export const rtlLanguageConstants: Readonly<Array<string>> = Object.freeze([
  "ar",
  "he",
  "fa",
  "ur"
]);

const LanguageConstants: Readonly<Array<LanguagesType>> = Object.freeze([
  { label: "English", value: "en" },
  { label: "اَلْعَرَبِيَّةُ", value: "ar" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
  { label: "汉语", value: "zh-CN" }
]);

const DictionaryConstants: any = Object.freeze({
  ar: {
    "auth.login": "تسجيل الدخول",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.continueWithEmail": "تابع بالبريد الإلكتروني",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.forgotPassword.instructions":
      "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور",
    "auth.resetPassword": "إعادة تعيين كلمة المرور",
    "auth.signup": "سجل",
    "auth.signup.question": "ليس لديك حساب؟",
    "auth.login.question": "هل سبق لك التسجيل؟",
    "auth.acknowledgement.1":
      "من خلال المتابعة، فإنك تقر بأنك قد قرأت ووافقت على",
    "auth.acknowledgement.tos": "شروط الخدمة",
    "auth.acknowledgement.2": "و",
    "auth.acknowledgement.pp": "سياسة الخصوصية",
    "auth.confirmEmail": "تأكيد البريد الإلكتروني",
    "auth.resendCode": "إعادة إرسال الرمز",
    "auth.code": "الرمز",
    "auth.submit": "إرسال",
    "auth.mfa": "المصادقة متعددة العوامل (MFA)"
  },
  en: {
    "auth.login": "Log in",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.continueWithEmail": "Continue with email",
    "auth.forgotPassword": "Forgot Password?",
    "auth.forgotPassword.instructions":
      "Enter your email address and we will send you a link to reset your password",
    "auth.resetPassword": "Reset Password",
    "auth.signup": "Sign up",
    "auth.signup.question": "Not yet signed up?",
    "auth.login.question": "Already signed up?",
    "auth.acknowledgement.1":
      "By continuing, you acknowledge that you have read and agree to our",
    "auth.acknowledgement.tos": "Terms of Service",
    "auth.acknowledgement.2": "and",
    "auth.acknowledgement.pp": "Privacy Policy",
    "auth.confirmEmail": "Confirm Email",
    "auth.resendCode": "Resend Code",
    "auth.code": "Code",
    "auth.submit": "Submit",
    "auth.mfa": "Multi-Factor Auth (MFA)"
  },
  es: {
    "auth.login": "Acceso",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.continueWithEmail": "Continuar con correo electrónico",
    "auth.forgotPassword": "¿Olvidó su contraseña?",
    "auth.forgotPassword.instructions":
      "Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña",
    "auth.resetPassword": "Restablecer la contraseña",
    "auth.signup": "Regístrate",
    "auth.signup.question": "¿Todavía no te has registrado?",
    "auth.login.question": "¿Ya te has registrado?",
    "auth.acknowledgement.1":
      "Al continuar, usted reconoce que ha leído y acepta nuestros",
    "auth.acknowledgement.tos": "Términos de servicio",
    "auth.acknowledgement.2": "y",
    "auth.acknowledgement.pp": "Política de privacidad",
    "auth.confirmEmail": "Confirmar correo electrónico",
    "auth.resendCode": "Reenviar código",
    "auth.code": "Código",
    "auth.submit": "Enviar",
    "auth.mfa": "Autenticación de Múltiples Factores (MFA)"
  },
  fr: {
    "auth.login": "Se connecter",
    "auth.email": "Courriel",
    "auth.password": "Mot de passe",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.continueWithEmail": "Continuer avec l'e-mail",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.forgotPassword.instructions":
      "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe",
    "auth.resetPassword": "Réinitialiser le mot de passe",
    "auth.signup": "S'inscrire",
    "auth.signup.question": "Pas encore inscrit?",
    "auth.login.question": "Déjà inscrit?",
    "auth.acknowledgement.1":
      "En continuant, vous reconnaissez avoir lu et accepté nos",
    "auth.acknowledgement.tos": "Conditions d'utilisation",
    "auth.acknowledgement.2": "et",
    "auth.acknowledgement.pp": "Politique de confidentialité",
    "auth.confirmEmail": "Confirmer l'e-mail",
    "auth.resendCode": "Renvoyer le code",
    "auth.code": "Code",
    "auth.submit": "Soumettre",
    "auth.mfa": "Authentification Multi-Facteurs (MFA)"
  },
  "zh-CN": {
    "auth.login": "登录",
    "auth.email": "电子邮件",
    "auth.password": "密码",
    "auth.confirmPassword": "确认密码",
    "auth.continueWithEmail": "继续使用电子邮件",
    "auth.forgotPassword": "忘记密码？",
    "auth.forgotPassword.instructions":
      "输入您的电子邮件地址，我们将向您发送重置密码的链接",
    "auth.resetPassword": "重设密码",
    "auth.signup": "注册",
    "auth.signup.question": "还没有注册？",
    "auth.login.question": "已经注册了？",
    "auth.acknowledgement.1": "继续即表示您承认您已阅读并同意我们的",
    "auth.acknowledgement.tos": "服务条款",
    "auth.acknowledgement.2": "和",
    "auth.acknowledgement.pp": "隐私政策",
    "auth.confirmEmail": "确认电子邮件",
    "auth.resendCode": "重新发送代码",
    "auth.code": "代码",
    "auth.submit": "提交",
    "auth.mfa": "多因素认证 (MFA)"
  }
});
