import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { fetchCountryBorderInfo } from "../apiClient/CountryApi";
import { removeArrayDuplicates } from "../utils";
import {
  POLAND,
  MOLDOVA,
  ROMANIA,
  HUNGARY,
  SLOVAKIA,
} from "../configs/constants";

const allCountries = (() => {
  // We don't want to translate yet but we do want i18next-parser
  // to find these strings
  const t = (s) => s;

  return {
    [POLAND]: {
      code: POLAND,
      name: t("Poland"),
      toName: t("to Poland"),
      inName: t("in Poland"),
      apiName: "poland",
    },
    [MOLDOVA]: {
      code: MOLDOVA,
      name: t("Moldova"),
      toName: t("to Moldova"),
      inName: t("in Moldova"),
      apiName: "moldova",
    },
    [ROMANIA]: {
      code: ROMANIA,
      name: t("Romania"),
      toName: t("to Romania"),
      inName: t("in Romania"),
      apiName: "romania",
    },
    [HUNGARY]: {
      code: HUNGARY,
      name: t("Hungary"),
      toName: t("to Hungary"),
      inName: t("in Hungary"),
      apiName: "hungary",
    },
    [SLOVAKIA]: {
      code: SLOVAKIA,
      name: t("Slovakia"),
      toName: t("to Slovakia"),
      inName: t("in Slovakia"),
      apiName: "slovakia",
    },
  };
})();

const getHashCountry = (defaultCountry, availableCountries) =>
  (typeof window !== "undefined" &&
      window.location.hash &&
      window.location.hash.length === 3 &&
      availableCountries.find(({ code }) =>
        code === window.location.hash.slice(1)))
  ? window.location.hash.slice(1)
  : defaultCountry;

const useCountryData = ({
  defaultCountry = null,
  availableCountries = [],
  fetchApiDataCallback = fetchCountryBorderInfo,
}) => {
  availableCountries = availableCountries.length
    ? availableCountries.map(code => allCountries[code])
    : Object.values(allCountries);

  defaultCountry = defaultCountry || availableCountries[0];

  const router = useRouter();

  const dataViewRef = useRef();

  const [library, setLibrary] = useState({});

  const [selectedCountry, setSelectedCountry] =
    useState(getHashCountry(defaultCountry, availableCountries));

  useEffect(() => {
    const handler = () =>
      setSelectedCountry(getHashCountry(defaultCountry, availableCountries));
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  });

  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const fetchCountryData = async (countryName) => {
    let data;
    try {
      data = await fetchApiDataCallback(countryName, language);
    } catch (error) {
      data = { error };
    }

    // TODO: Can we remove the duplicated entries on the backend?
    if (data?.general)
      data.general = removeArrayDuplicates(data.general);

    setLibrary({
      ...library,
      [language]: {
        ...library[language],
        [countryName]: data,
      },
    });
  }

  const getCountryData = (countryName) => {
    const countries = library[language];
    if (countries) {
      const data = countries[countryName];
      if (data) {
        return data;
      }
    }

    fetchCountryData(countryName);
    return null;
  }

  const countryData = getCountryData(allCountries[selectedCountry].apiName)

  return {
    t,
    availableCountries,
    selectedCountryData: {
      ...allCountries[selectedCountry],
      data: countryData,
    },
    setSelectedCountry: (countryCode) => {
      router.replace(`${router.route}#${countryCode}`);
      setSelectedCountry(countryCode);
      if (dataViewRef.current)
        dataViewRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
    },
    dataViewRef,
  };
}

export default useCountryData;
