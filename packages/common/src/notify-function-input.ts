export type NotifyFunctionInputDetails = {
  recipientEmail: string;
  testDate: string;
  nameOfParent: string;
  firstNameOfChild: string;
  lastNameOfChild: string;
  genderOfChild: string;
  dobOfChild: string;
  doctorEmail: string;
  ageInMonths: number;
  subsite: string;
  location: string;
};

export type RecordedAnswer = {
  value: string;
  comments: string;
};

export type NotifyFunctionResults = {
  [questionnaireId: string]:
    | {
        [answerId: string]: RecordedAnswer | undefined;
      }
    | undefined;
};

export type NotifyFunctionInput = {
  details: NotifyFunctionInputDetails;
  results: NotifyFunctionResults;
};
