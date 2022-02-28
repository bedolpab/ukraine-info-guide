import React from "react";
import SelectSearch from "react-select-search";
import { useRouter } from "next/router";

const languages = [
  { value: "en", name: "English" },
  { value: "ua", name: "Українська" },
  { value: "ru", name: "Русский" },
  { value: "it", name: "Italiano" },
  { value: "de", name: "Deutsch" },
  { value: "es", name: "Español" },
  { value: "pl", name: "Polski" },
  { value: "kr", name: "한국어" },
  { value: "rs", name: "Српски" },
];

const LanguagePicker = () => {
  const router = useRouter();

  const updateLocale = (locale) =>
    router.push(router.asPath, router.asPath, { locale });

  return (
    <SelectSearch
      name="language"
      options={languages}
      value={languages.find(({ value }) => value === (router.locale || "en"))}
      onChange={updateLocale}
    />
  );
}

export default LanguagePicker;