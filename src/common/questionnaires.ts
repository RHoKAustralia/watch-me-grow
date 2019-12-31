import { StrategyId } from "./strategy-id";

export type Answer = {
  value: string;
  textId: string;
  redFlagScore: number;
};

export type Question = {
  id: string;
  textId: string;
  comments?: boolean;
  answers: Answer[];
  scoreGroup?: string;
};

export type Questionnaire = {
  id: string;
  title: string;
  category: "development" | "behaviour" | "emotions";
  subcategory?: "development" | "communication";
  ageGroups: {
    min: number;
    max: number;
  };
  analysis: {
    strategy: StrategyId;
    redFlagThreshold: number;
  };
  /**
   * The age of the child in months to remind parents to do this questionnaire,
   * if it's set as part of the site that they were on.
   */
  remindAt?: number;
  questions: Question[];
};

const cdcShouldBeYesAnswer: Answer[] = [
  {
    value: "yes",
    textId: "answers.cdc.yes",
    redFlagScore: 0
  },
  {
    value: "no",
    textId: "answers.cdc.no",
    redFlagScore: 1
  },
  {
    value: "notsure",
    textId: "answers.cdc.notSure",
    redFlagScore: 1
  }
];

const cdcShouldBeNoAnswer: Answer[] = [
  {
    value: "yes",
    textId: "answers.cdc.yes",
    redFlagScore: 1
  },
  {
    value: "no",
    textId: "answers.cdc.no",
    redFlagScore: 0
  },
  {
    value: "notsure",
    textId: "answers.cdc.notSure",
    redFlagScore: 1
  }
];

const pdqAnswersShouldBeOften: Answer[] = [
  {
    value: "rarely",
    textId: "answers.pdq1.rarely",
    redFlagScore: 0
  },
  {
    value: "sometimes",
    textId: "answers.pdq1.sometimes",
    redFlagScore: 1
  },
  {
    value: "often",
    textId: "answers.pdq1.often",
    redFlagScore: 2
  }
];
const pdqAnswersShouldBeRarely: Answer[] = [
  {
    value: "rarely",
    textId: "answers.pdq1.rarely",
    redFlagScore: 0
  },
  {
    value: "sometimes",
    textId: "answers.pdq1.sometimes",
    redFlagScore: 1
  },
  {
    value: "often",
    textId: "answers.pdq1.often",
    redFlagScore: 2
  }
];

const asqAnswersShouldAgree: Answer[] = [
  {
    value: "definitely-agree",
    textId: "answers.asq.definitelyAgree",
    redFlagScore: 0
  },
  {
    value: "slightly-agree",
    textId: "answers.asq.slightlyAgree",
    redFlagScore: 0
  },
  {
    value: "slightly-disagree",
    textId: "answers.asq.slightlyDisagree",
    redFlagScore: 1
  },
  {
    value: "definitely-disagree",
    textId: "answers.asq.definitelyDisagree",
    redFlagScore: 1
  }
];
const asqAnswersShouldDisagree: Answer[] = [
  {
    value: "definitely-agree",
    textId: "answers.asq.definitelyAgree",
    redFlagScore: 1
  },
  {
    value: "slightly-agree",
    textId: "answers.asq.slightlyAgree",
    redFlagScore: 1
  },
  {
    value: "slightly-disagree",
    textId: "answers.asq.slightlyDisagree",
    redFlagScore: 0
  },
  {
    value: "definitely-disagree",
    textId: "answers.asq.definitelyDisagree",
    redFlagScore: 0
  }
];

const qchatShouldBeNever: Answer[] = [
  {
    value: "always",
    textId: "answers.qchat.always",
    redFlagScore: 0
  },
  {
    value: "usually",
    textId: "answers.qchat.usually",
    redFlagScore: 0
  },
  {
    value: "sometimes",
    textId: "answers.qchat.sometimes",
    redFlagScore: 1
  },
  {
    value: "rarely",
    textId: "answers.qchat.rarely",
    redFlagScore: 1
  },
  {
    value: "never",
    textId: "answers.qchat.never",
    redFlagScore: 1
  }
];

const qchatShouldBeImpossible: Answer[] = [
  {
    value: "veryeasy",
    textId: "answers.qchat.veryEasy",
    redFlagScore: 0
  },
  {
    value: "quiteeasy",
    textId: "answers.qchat.quiteEasy",
    redFlagScore: 0
  },
  {
    value: "quitedifficult",
    textId: "answers.qchat.quiteDifficult",
    redFlagScore: 1
  },
  {
    value: "verydifficult",
    textId: "answers.qchat.veryDifficult",
    redFlagScore: 1
  },
  {
    value: "impossible",
    textId: "answers.qchat.impossible",
    redFlagScore: 1
  }
];

const qchatShouldBeNeverWeek: Answer[] = [
  {
    value: "manyday",
    textId: "answers.qchat.manyDay",
    redFlagScore: 0
  },
  {
    value: "fewday",
    textId: "answers.qchat.fewDay",
    redFlagScore: 0
  },
  {
    value: "fewweek",
    textId: "answers.qchat.fewWeek",
    redFlagScore: 1
  },
  {
    value: "lessonceweek",
    textId: "answers.qchat.lessOnceWeek",
    redFlagScore: 1
  },
  {
    value: "never",
    textId: "answers.qchat.never",
    redFlagScore: 1
  }
];

const qchatShouldBeVerbal: Answer[] = [
  {
    value: "verytypical",
    textId: "answers.qchat.veryTypical",
    redFlagScore: 0
  },
  {
    value: "quitetypical",
    textId: "answers.qchat.quiteTypical",
    redFlagScore: 0
  },
  {
    value: "slightlyunusual",
    textId: "answers.qchat.slightlyUnusual",
    redFlagScore: 1
  },
  {
    value: "veryunusual",
    textId: "answers.qchat.veryUnusual",
    redFlagScore: 1
  },
  {
    value: "nonverbal",
    textId: "answers.qchat.nonVerbal",
    redFlagScore: 1
  }
];

const qchatShouldBeManyTimesPerDay: Answer[] = [
  {
    value: "manyday",
    textId: "answers.qchat.manyDay",
    redFlagScore: 1
  },
  {
    value: "fewday",
    textId: "answers.qchat.fewDay",
    redFlagScore: 1
  },
  {
    value: "fewweek",
    textId: "answers.qchat.fewWeek",
    redFlagScore: 1
  },
  {
    value: "lessonceweek",
    textId: "answers.qchat.lessOnceWeek",
    redFlagScore: 0
  },
  {
    value: "never",
    textId: "answers.qchat.never",
    redFlagScore: 0
  }
];

const bpscAnswers: Answer[] = [
  {
    value: "notAtAll",
    textId: "answers.bpsc.notAtAll",
    redFlagScore: 0
  },
  {
    value: "somewhat",
    textId: "answers.bpsc.somewhat",
    redFlagScore: 1
  },
  {
    value: "veryMuch",
    textId: "answers.bpsc.veryMuch",
    redFlagScore: 2
  }
];

const yesNoAnswers: Answer[] = [
  {
    value: "yes",
    textId: "answers.yes",
    redFlagScore: 1
  },
  {
    value: "no",
    textId: "answers.no",
    redFlagScore: 0
  }
];

const pedsAnswers: Answer[] = [
  {
    value: "no",
    textId: "answers.no",
    redFlagScore: 0
  },
  {
    value: "alittle",
    textId: "answers.peds.aLittle",
    redFlagScore: 1
  },
  {
    value: "yes",
    textId: "answers.yes",
    redFlagScore: 1
  }
];

const peds: Questionnaire = {
  id: "peds",
  title: "PEDS",
  category: "development",
  subcategory: "development",
  ageGroups: {
    min: 6,
    max: 48
  },
  analysis: {
    strategy: "simple",
    redFlagThreshold: 1
  },
  questions: [
    {
      id: "concerns",
      textId: "questions.peds.learningConcerns",
      comments: true,
      answers: pedsAnswers
    },

    {
      id: "speech_sound",
      textId: "questions.peds.speechConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "understand_speech",
      textId: "questions.peds.understandConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "using_hand",
      textId: "questions.peds.handConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "using_arm_leg",
      textId: "questions.peds.armsLegsConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "behaviour",
      textId: "questions.peds.behaviourConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "getting_along",
      textId: "questions.peds.gettingAlongConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "learning",
      textId: "questions.peds.learningThemselvesConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "learning_at_preschool",
      textId: "questions.peds.preschoolConcerns",
      comments: true,
      answers: pedsAnswers
    },
    {
      id: "other_concerns",
      textId: "questions.peds.otherConcerns",
      comments: true,
      answers: pedsAnswers
    }
  ]
};

const questionnaires: Questionnaire[] = [
  {
    id: "cdc6",
    title: "CDC 6 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 6, max: 8 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "reach6",
        textId: "questions.cdc6.reach",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "affection6",
        textId: "questions.cdc6.affection",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond_to_sounds6",
        textId: "questions.cdc6.respondToSounds",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "difficulty_mouth6",
        textId: "questions.cdc6.difficultyMouth",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "vowel_sounds6",
        textId: "questions.cdc6.vowelSounds",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "roll6",
        textId: "questions.cdc6.roll",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "squealing6",
        textId: "questions.cdc6.squealing",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "tight_muscles6",
        textId: "questions.cdc6.tightMuscles",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "lost_skills",
        textId: "questions.cdc6.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc9",
    title: "CDC 9 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 9, max: 11 },
    remindAt: 9,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "bear_weight",
        textId: "questions.cdc9.bearWeight",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "sit_without_help",
        textId: "questions.cdc9.sitWithoutHelp",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "babbles",
        textId: "questions.cdc9.babbles",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "back_and_forth",
        textId: "questions.cdc9.backAndForth",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "responds_to_own_name",
        textId: "questions.cdc9.respondsToOwnName",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "recognise_familiar_people",
        textId: "questions.cdc9.recogniseFamiliarPeople",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "looks_where_you_point",
        textId: "questions.cdc9.looksWhereYouPoint",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "can_transfer_toys",
        textId: "questions.cdc9.canTransferToys",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        textId: "questions.cdc9.looksWhereYouPoint",
        answers: cdcShouldBeYesAnswer
      }
    ]
  },
  {
    id: "cdc12",
    title: "CDC 12 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 12, max: 17 },
    remindAt: 12,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "crawl",
        textId: "questions.cdc12.crawl",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "stand",
        textId: "questions.cdc12.stand",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "search_hidden",
        textId: "questions.cdc12.searchHidden",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "single_words",
        textId: "questions.cdc12.singleWords",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "gestures",
        textId: "questions.cdc12.gestures",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "point",
        textId: "questions.cdc12.point",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        textId: "questions.cdc12.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc18",
    title: "CDC 18 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 18, max: 23 },
    remindAt: 18,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "point18",
        comments: false,
        textId: "questions.cdc18.point",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk18",
        textId: "questions.cdc18.walk",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "know_familiar18",
        textId: "questions.cdc18.knowFamiliar",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_others18",
        textId: "questions.cdc18.copyOthers",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "words18",
        textId: "questions.cdc18.words",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "learn_words18",
        textId: "questions.cdc18.learnWords",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "notice_carer18",
        textId: "questions.cdc18.noticeCarer",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills18",
        textId: "questions.cdc18.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc24",
    title: "CDC 24 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 24, max: 35 },
    remindAt: 24,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "two_word_phrases24",
        textId: "questions.cdc24.twoWordPhrases",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "common_things24",
        textId: "questions.cdc24.commonThings",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_actions24",
        textId: "questions.cdc24.copyActions",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "simple_instructions24",
        textId: "questions.cdc24.simpleInstructions",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk_steady24",
        textId: "questions.cdc24.walkSteady",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills24",
        textId: "questions.cdc24.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc36",
    title: "CDC 36 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 36, max: 47 },
    remindAt: 36,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "fall_down36",
        textId: "questions.cdc36.fallDown",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "drool36",
        textId: "questions.cdc36.drool",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "struggle36",
        textId: "questions.cdc36.struggle",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "speak36",
        textId: "questions.cdc36.speak",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "instructions36",
        textId: "questions.cdc36.instructions",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "pretend36",
        textId: "questions.cdc36.pretend",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "toys36",
        textId: "questions.cdc36.toys",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "eye_contact36",
        textId: "questions.cdc36.eyeContact",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills36",
        textId: "questions.cdc36.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc48",
    title: "CDC 48 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 48, max: 59 },
    remindAt: 48,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "jump48",
        textId: "questions.cdc48.jump",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "scribbling48",
        textId: "questions.cdc48.scribbling",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games48",
        textId: "questions.cdc48.games",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond48",
        textId: "questions.cdc48.respond",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "resist48",
        textId: "questions.cdc48.resist",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "retell48",
        textId: "questions.cdc48.retell",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "follow48",
        textId: "questions.cdc48.follow",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "same_different48",
        textId: "questions.cdc48.sameDifferent",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "me_you48",
        textId: "questions.cdc48.meYou",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "speak_unclearly48",
        textId: "questions.cdc48.speakUnclearly",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills48",
        textId: "questions.cdc48.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc60",
    title: "CDC 60 Months",
    category: "development",
    subcategory: "development",
    ageGroups: { min: 60, max: 72 },
    remindAt: 60,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "wide_emotions60",
        textId: "questions.cdc60.wideEmotions",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "extreme_behaviour60",
        textId: "questions.cdc60.extremeBehaviour",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "withdrawn60",
        textId: "questions.cdc60.withdrawn",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "distracted60",
        textId: "questions.cdc60.distracted",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "respond60",
        textId: "questions.cdc60.respond",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "make_believe60",
        textId: "questions.cdc60.makeBelieve",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games60",
        textId: "questions.cdc60.games",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "names60",
        textId: "questions.cdc60.names",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "plurals60",
        textId: "questions.cdc60.plurals",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "daily_activities60",
        textId: "questions.cdc60.dailyActivities",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "drawing60",
        textId: "questions.cdc60.drawing",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "brush_dry_wash60",
        textId: "questions.cdc60.brushDryWash",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills60",
        textId: "questions.cdc60.lostSkills",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "qchat",
    title: "QCHAT",
    category: "development",
    subcategory: "communication",
    ageGroups: { min: 16, max: 30 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 3
    },
    questions: [
      {
        id: "lookatyou",
        textId: "questions.qchat.lookAtYou",
        answers: qchatShouldBeNever
      },
      {
        id: "eyecontacteasiness",
        textId: "questions.qchat.eyeContactEasiness",
        answers: qchatShouldBeImpossible
      },
      {
        id: "pointwant",
        textId: "questions.qchat.pointWant",
        answers: qchatShouldBeNeverWeek
      },
      {
        id: "pointshareinterest",
        textId: "questions.qchat.pointShareInterest",
        answers: qchatShouldBeNeverWeek
      },
      {
        id: "pretending",
        textId: "questions.qchat.pretending",
        answers: qchatShouldBeNeverWeek
      },
      {
        id: "followlooking",
        textId: "questions.qchat.followLooking",
        answers: qchatShouldBeNeverWeek
      },
      {
        id: "comfort",
        textId: "questions.qchat.comfort",
        answers: qchatShouldBeNever
      },
      {
        id: "firstwords",
        textId: "questions.qchat.firstWords",
        answers: qchatShouldBeVerbal
      },
      {
        id: "simplegestures",
        textId: "questions.qchat.simpleGestures",
        answers: qchatShouldBeNeverWeek
      },
      {
        id: "stareatnothing",
        textId: "questions.qchat.stareAtNothing",
        answers: qchatShouldBeManyTimesPerDay
      }
    ]
  },
  {
    id: "pdq1",
    title: "Psychological Development Questionnaire For Toddlers (PDQ1)",
    category: "development",
    subcategory: "communication",
    ageGroups: { min: 30, max: 47 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 12
    },
    questions: [
      {
        id: "points-or-gestures",
        textId: "questions.pdq1.pointsOrGestures",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "unusual-responses",
        textId: "questions.pdq1.unusualResponses",
        answers: pdqAnswersShouldBeRarely
      },

      {
        id: "smiles",
        textId: "questions.pdq1.smiles",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "responds-to-name",
        textId: "questions.pdq1.respondsToName",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "shows-interest",
        textId: "questions.pdq1.showsInterest",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "enjoys-handshake-peekaboo",
        textId: "questions.pdq1.enjoysHandshakePeekaboo",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "relates-to-others",
        textId: "questions.pdq1.relatesToOthers",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "uses-3-or-more-words-regularly",
        textId: "questions.pdq1.usesThreeOrMoreWordsRegularly",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "speaks-in-phrases",
        textId: "questions.pdq1.speaksInPhrases",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "laughs-when-others-laugh",
        textId: "questions.pdq1.laughsWhenOthersLaugh",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "stopped-using-words",
        textId: "questions.pdq1.stoppedUsingWords",
        answers: pdqAnswersShouldBeRarely
      }
    ]
  },
  {
    id: "asq10",
    title: "Autism Spectrum Quotient",
    category: "development",
    subcategory: "communication",
    ageGroups: { min: 48, max: 72 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 7
    },
    questions: [
      {
        id: "notices-small-sounds",
        textId: "questions.asq10.noticesSmallSounds",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "concentrates-on-whole-picture",
        textId: "questions.asq10.concentratesOnWholePicture",
        answers: asqAnswersShouldAgree
      },
      {
        id: "tracks-multiple-conversations",
        textId: "questions.asq10.tracksMultipleConversations",
        answers: asqAnswersShouldAgree
      },
      {
        id: "goes-back-and-forth",
        textId: "questions.asq10.goesBackAndForth",
        answers: asqAnswersShouldAgree
      },
      {
        id: "doesnt-know-how-to-keep-convo-going",
        textId: "questions.asq10.doesntKnowHowToKeepConvoGoing",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "good-at-chit-chat",
        textId: "questions.asq10.goodAtChitChat",
        answers: asqAnswersShouldAgree
      },
      {
        id: "difficult-to-work-out-feelings",
        textId: "questions.asq10.difficultToWorkOutFeelings",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "enjoyed-pretending",
        textId: "questions.asq10.enjoyedPretending",
        answers: asqAnswersShouldAgree
      },
      {
        id: "easy-to-work-out-feelings",
        textId: "questions.asq10.easyToWorkOutFeelings",
        answers: asqAnswersShouldAgree
      },
      {
        id: "hard-to-make-friends",
        textId: "questions.asq10.hardToMakeFriends",
        answers: asqAnswersShouldDisagree
      }
    ]
  },
  {
    id: "rqc",
    title: "Reporting Questionnaire for Children (RQC)",
    category: "development",
    subcategory: "communication",
    ageGroups: { min: 31, max: 66 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "behaviour",
        textId: "questions.rqc.behaviour",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "calming",
        textId: "questions.rqc.calming",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "sleep",
        textId: "questions.rqc.sleep",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "worries",
        textId: "questions.rqc.worries",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "disobedience",
        textId: "questions.rqc.disobedience",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "fighting",
        textId: "questions.rqc.fighting",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "feeding",
        textId: "questions.rqc.feeding",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "learning",
        textId: "questions.rqc.learning",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "friendships",
        textId: "questions.rqc.friendships",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "rituals",
        textId: "questions.rqc.rituals",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "bpsc",
    title: "Baby Pediatric Symptom Checklist (BPSC)",
    category: "behaviour",
    ageGroups: { min: 6, max: 17 },
    analysis: {
      strategy: "bpsc",
      redFlagThreshold: 3
    },
    questions: [
      {
        id: "newPeople",
        textId: "questions.bpsc.newPeople",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "1"
      },
      {
        id: "newPlaces",
        textId: "questions.bpsc.newPlaces",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "1"
      },
      {
        id: "change",
        textId: "questions.bpsc.change",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "1"
      },
      {
        id: "heldOtherPeople",
        textId: "questions.bpsc.heldOtherPeople",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "1"
      },
      {
        id: "cryALot",
        textId: "questions.bpsc.cryALot",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "2"
      },
      {
        id: "calmingDown",
        textId: "questions.bpsc.calmingDown",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "2"
      },
      {
        id: "fussy",
        textId: "questions.bpsc.fussy",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "2"
      },
      {
        id: "hardToComfort",
        textId: "questions.bpsc.hardToComfort",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "2"
      },
      {
        id: "schedule",
        textId: "questions.bpsc.schedule",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "3"
      },
      {
        id: "hardToPutToSleep",
        textId: "questions.bpsc.hardToPutToSleep",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "3"
      },
      {
        id: "hardToGetToSleep",
        textId: "questions.bpsc.hardToGetToSleep",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "3"
      },
      {
        id: "troubleStayingAsleep",
        textId: "questions.bpsc.troubleStayingAsleep",
        comments: false,
        answers: bpscAnswers,
        scoreGroup: "3"
      }
    ]
  },
  {
    id: "ppsc",
    title: "Preschool Pediatric Symptom Checklist (PPSC)",
    category: "behaviour",
    ageGroups: { min: 18, max: 30 },
    remindAt: 18,
    analysis: {
      strategy: "simple",
      redFlagThreshold: 9
    },
    questions: [
      {
        id: "nervousOrAfraid",
        textId: "questions.ppsc.nervousOrAfraid",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "sadOrUnhappy",
        textId: "questions.ppsc.sadOrUnhappy",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "upset",
        textId: "questions.ppsc.upset",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "change",
        textId: "questions.ppsc.change",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "troublePlaying",
        textId: "questions.ppsc.troublePlaying",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "breakThings",
        textId: "questions.ppsc.breakThings",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "fights",
        textId: "questions.ppsc.fights",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "troublePayingAttention",
        textId: "questions.ppsc.troublePayingAttention",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardCalmingDown",
        textId: "questions.ppsc.hardCalmingDown",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "troubleStaying",
        textId: "questions.ppsc.troubleStaying",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "aggressive",
        textId: "questions.ppsc.aggressive",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "fidgety",
        textId: "questions.ppsc.fidgety",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "angry",
        textId: "questions.ppsc.angry",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardToTakeInPublic",
        textId: "questions.ppsc.hardToTakeInPublic",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardToComfort",
        textId: "questions.ppsc.hardToComfort",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardToKnowNeeds",
        textId: "questions.ppsc.hardToKnowNeeds",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardToSchedule",
        textId: "questions.ppsc.hardToSchedule",
        comments: false,
        answers: bpscAnswers
      },
      {
        id: "hardToObey",
        textId: "questions.ppsc.hardToObey",
        comments: false,
        answers: bpscAnswers
      }
    ]
  },
  {
    id: "psq4d",
    title: "Primary Care Screening Questionnaire for Depression (PSQ4D)",
    category: "emotions",
    ageGroups: { min: 6, max: 66 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 2
    },
    questions: [
      {
        id: "sadness",
        textId: "questions.psq4d.sadness",
        comments: false,
        answers: yesNoAnswers
      },
      {
        id: "lossOfInterest",
        textId: "questions.psq4d.lossOfInterest",
        comments: false,
        answers: yesNoAnswers
      },
      {
        id: "excessivelyTired",
        textId: "questions.psq4d.excessivelyTired",
        comments: false,
        answers: yesNoAnswers
      },
      {
        id: "sleeplessness",
        textId: "questions.psq4d.sleeplessness",
        comments: false,
        answers: yesNoAnswers
      }
    ]
  },
  peds
];

export default questionnaires;
