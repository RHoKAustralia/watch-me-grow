import { NotifyFunctionInput } from "src/common/notify-function-input";

export const DEFAULT_PARENT_EMAIL = "test.parent@example.com";
export const DEFAULT_DOCTOR_EMAIL = "test.doctor@example.com";

export const DEFAULT_PAYLOAD = Object.freeze({
  details: {
    recipientEmail: DEFAULT_PARENT_EMAIL,
    testDate: "2019-12-09T12:14:22.933Z",
    nameOfParent: "Test Parent",
    firstNameOfChild: "TestFirstName",
    lastNameOfChild: "Test",
    genderOfChild: "male",
    dobOfChild: "2019-05-28T14:00:00.000Z",
    doctorEmail: DEFAULT_DOCTOR_EMAIL,
    ageInMonths: 6,
    siteId: "main",
    language: "en"
  },
  results: {
    cdc6: {
      reach6: { value: "no" },
      affection6: { value: "no" },
      respond_to_sounds6: { value: "yes" },
      difficulty_mouth6: { value: "no" },
      vowel_sounds6: { value: "yes" },
      roll6: { value: "yes" },
      squealing6: { value: "no" },
      tight_muscles6: { value: "no" },
      lost_skills: { value: "yes" }
    },
    peds: {
      concerns: { value: "alittle", comments: "aerg" },
      speech_sound: { value: "no" },
      understand_speech: { value: "no" },
      using_hand: { value: "no" },
      using_arm_leg: { value: "no" },
      behaviour: { value: "no" },
      getting_along: { value: "no" },
      learning: { value: "no" },
      learning_at_preschool: { value: "no" },
      other_concerns: { value: "no" }
    }
  },
  consent: {
    receiveCopy: false,
    understandConsent: false,
    infoSheet: false,
    understandAim: false,
    opportunityToAsk: false,
    agreeToParticipate: false
  }
});

export const buildDefaultPayload: () => NotifyFunctionInput = () => ({
  ...DEFAULT_PAYLOAD
});

export const buildNoConcernPayload: () => NotifyFunctionInput = () => {
  const defaultPayload = buildDefaultPayload();

  return {
    ...defaultPayload,
    results: {
      cdc6: {
        reach6: { value: "yes" },
        affection6: { value: "yes" },
        respond_to_sounds6: { value: "yes" },
        difficulty_mouth6: { value: "no" },
        vowel_sounds6: { value: "yes" },
        roll6: { value: "yes" },
        squealing6: { value: "yes" },
        tight_muscles6: { value: "no" },
        lost_skills: { value: "no" }
      },
      peds: {
        concerns: { value: "no", comments: "aerg" },
        speech_sound: { value: "no" },
        understand_speech: { value: "no" },
        using_hand: { value: "no" },
        using_arm_leg: { value: "no" },
        behaviour: { value: "no" },
        getting_along: { value: "no" },
        learning: { value: "no" },
        learning_at_preschool: { value: "no" },
        other_concerns: { value: "no" }
      }
    }
  };
};
