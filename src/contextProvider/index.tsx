import { createContext, useState, FC, useMemo, useContext } from 'react';

const defaultAppContext = {
  error: null,
  termsAndConditionsVersion: null,
  termsAndConditions: null
};

export const AppContext = createContext<any>(defaultAppContext);

export const AppContextProvider: FC = (props) => {
  const [error, setError] = useState<string | null>();
  const [termsAndConditionsVersion, setTermsAndConditionsVersion] = useState<string | null>();
  const [termsAndConditions, setTermsAndConditions] = useState<string | null>();

  const value = useMemo(
    () => ({
      error,
      setError,
      termsAndConditionsVersion,
      setTermsAndConditionsVersion,
      termsAndConditions,
      setTermsAndConditions
    }),
    [error, termsAndConditionsVersion, termsAndConditions]
  );

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
