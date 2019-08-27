export type NotifyFunctionInputDetails = {
  recipientEmail: string;
  testDate: string;
  nameOfParent: string;
  firstNameOfChild: string;
  lastNameOfChild: string;
  genderOfChild: string;
  dobOfChild: string;
  doctorEmail?: string;
  ageInMonths: number;
  siteId: string;
  language: string;
};

export type RecordedAnswer = {
  value: string;
  comments: string;
};

export type NotifyFunctionResults = {
  [questionnaireId: string]: {
    [answerId: string]: RecordedAnswer;
  };
};

export type ConsentInfo = "studyOnly" | "futureRelated" | "futureAny";

export type Consent = {
  info?: ConsentInfo;
  receiveCopy: boolean;
  understandConsent: boolean;
  infoSheet: boolean;
  understandAim: boolean;
  opportunityToAsk: boolean;
  agreeToParticipate: boolean;
};

export type NotifyFunctionInput = {
  details: NotifyFunctionInputDetails;
  results: NotifyFunctionResults;
  consent?: Consent;
};
