import { useEffect, useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { Select } from "@/components/fields/Select";

import { getAvailableLanguages, rtlLanguageConstants } from "@/hooks/use-i18n";

import { Dictionary } from "@/i18n";

// TODO: move to constants
// TODO: import here and also in layouts/ ?
const colorSchemes = [
  { label: "Auto", value: "auto" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const Appearance = () => {
  const [theme, setTheme] = useState();
  const [language, setLanguage] = useState();

  // match the theme select value to the user's preference on initial load
  useEffect(() => {
    const _theme = localStorage.getItem("theme");
    const _lang = localStorage.getItem("lang");
    if (_theme !== theme) {
      setTheme(_theme);
    };
    if (_lang !== language) {
      setLanguage(_lang);
    };
    return;
  }, [])
  
  // update the theme on user selection
  const onSetTheme = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    let _theme = value;
    if (_theme === "auto") {
      _theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    document.documentElement.classList[_theme === "dark" ? "add" : "remove"]("dark");
    return;
  };

  const onSetLanguage = (value) => {
    setLanguage(value);
    localStorage.setItem("lang", value);
    document.documentElement.lang = value;
    if ([...rtlLanguageConstants].includes(value)) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    };
    window.location.reload();
    return;
  };

  const languages = getAvailableLanguages({ dictionary: Dictionary });

  return(
    <div className="w-full md:w-1/2 flex flex-col space-y-8">
      <AccountSection title="Theme">
        <Select
          items={colorSchemes}
          value={theme}
          onChange={onSetTheme}
        />
      </AccountSection>
      <AccountSection title="Language">
        <Select
          items={languages}
          value={language}
          onChange={onSetLanguage}
        />
      </AccountSection>
    </div>
  );
};
export default Appearance;
