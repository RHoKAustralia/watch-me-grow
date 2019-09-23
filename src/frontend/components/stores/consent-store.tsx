import React, { useState, FunctionComponent, useEffect } from "react";
import { Consent, ConsentInfo } from "src/common/notify-function-input";

const SESSION_STORAGE_KEY = "wmg-consent";

type Errors = {
  info?: boolean;
  receiveCopy?: boolean;
  understandConsent?: boolean;
  infoSheet?: boolean;
  understandAim?: boolean;
  opportunityToAsk?: boolean;
  agreeToParticipate?: boolean;
};

function clear() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

function save(consent: Consent) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(consent));
}

function getFromStorage(): Consent {
  const string = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return string ? JSON.parse(string) : { receiveCopy: false };
}

export type ConsentState = {
  consent: Consent;
  setInfo: (info: ConsentInfo) => void;
  setReceiveCopy: (receiveCopy: boolean) => void;
  setUnderstandConsent: (understandConsent: boolean) => void;
  setInfoSheet: (infoSheet: boolean) => void;
  setUnderstandAim: (understandAim: boolean) => void;
  setOpportunityToAsk: (opportunityToAsk: boolean) => void;
  setAgreeToParticipate: (agreeToParticipate: boolean) => void;
  validate: () => boolean;
  errors: Errors;
  save: () => void;
  clear: () => void;
};

export const ConsentContext = React.createContext<ConsentState>({
  consent: {
    receiveCopy: false,
    understandConsent: false,
    infoSheet: false,
    understandAim: false,
    opportunityToAsk: false,
    agreeToParticipate: false
  },
  setInfo: info => {},
  setReceiveCopy: receiveCopy => {},
  setUnderstandConsent: understandConsent => {},
  setInfoSheet: infoSheet => {},
  setUnderstandAim: understandAim => {},
  setOpportunityToAsk: opportunityToAsk => {},
  setAgreeToParticipate: agreeToParticipate => {},
  validate: () => false,
  errors: {},
  save: () => {},
  clear: () => {}
});

export const ConsentStore: FunctionComponent<{}> = ({ children }) => {
  useEffect(() => {
    const contextFromStorage = getFromStorage();
    setInfo(contextFromStorage.info);
    setReceiveCopy(contextFromStorage.receiveCopy);
  }, []);

  const [understandConsent, setUnderstandConsent] = useState(false);
  const [infoSheet, setInfoSheet] = useState(false);
  const [understandAim, setUnderstandAim] = useState(false);
  const [opportunityToAsk, setOpportunityToAsk] = useState(false);
  const [agreeToParticipate, setAgreeToParticipate] = useState(false);
  const [info, setInfo] = useState<ConsentInfo | undefined>();
  const [receiveCopy, setReceiveCopy] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    setErrors({
      understandConsent: !understandConsent,
      info: !info,
      infoSheet: !infoSheet,
      understandAim: !understandAim,
      opportunityToAsk: !opportunityToAsk,
      agreeToParticipate: !agreeToParticipate
    });
    return (
      !!understandConsent &&
      !!info &&
      !!infoSheet &&
      !!understandAim &&
      !!opportunityToAsk &&
      !!agreeToParticipate
    );
  };

  const consent: Consent = {
    info,
    receiveCopy,
    understandConsent,
    infoSheet,
    understandAim,
    opportunityToAsk,
    agreeToParticipate
  };

  const value = {
    consent,
    setInfo,
    setReceiveCopy,
    setUnderstandConsent,
    setInfoSheet,
    setUnderstandAim,
    setOpportunityToAsk,
    setAgreeToParticipate,
    validate,
    errors,
    save: () => save(consent),
    clear: () => {
      clear();
      setUnderstandConsent(false);
      setInfoSheet(false);
      setUnderstandAim(false);
      setOpportunityToAsk(false);
      setAgreeToParticipate(false);
      setInfo(undefined);
    }
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
};
