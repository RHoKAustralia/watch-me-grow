import { StrategyId } from "./strategy-id";

export type Answer = {
  value: string;
  text: string;
  redFlagScore: number;
};

export type Question = {
  id: string;
  text: string;
  comments?: boolean;
  answers: Answer[];
};

export type Questionnaire = {
  id: string;
  title: string;
  category: "development" | "communication";
  age_groups: {
    min: number;
    max: number;
  };
  analysis: {
    strategy: StrategyId;
    redFlagThreshold: number;
  };
  remind_at?: number;
  questions: Question[];
};

const cdcShouldBeYesAnswer: Answer[] = [
  {
    value: "yes",
    text: "Yes",
    redFlagScore: 0
  },
  {
    value: "no",
    text: "No",
    redFlagScore: 1
  },
  {
    value: "notsure",
    text: "Not Sure",
    redFlagScore: 1
  }
];

const cdcShouldBeNoAnswer: Answer[] = [
  {
    value: "yes",
    text: "Yes",
    redFlagScore: 1
  },
  {
    value: "no",
    text: "No",
    redFlagScore: 0
  },
  {
    value: "notsure",
    text: "Not Sure",
    redFlagScore: 1
  }
];

const pdqAnswersShouldBeOften: Answer[] = [
  {
    value: "rarely",
    text: "rarely",
    redFlagScore: 0
  },
  {
    value: "sometimes",
    text: "sometimes",
    redFlagScore: 1
  },
  {
    value: "often",
    text: "often",
    redFlagScore: 2
  }
];
const pdqAnswersShouldBeRarely: Answer[] = [
  {
    value: "rarely",
    text: "rarely",
    redFlagScore: 0
  },
  {
    value: "sometimes",
    text: "sometimes",
    redFlagScore: 1
  },
  {
    value: "often",
    text: "often",
    redFlagScore: 2
  }
];

const asqAnswersShouldAgree: Answer[] = [
  {
    value: "definitely-agree",
    text: "Definitely agree",
    redFlagScore: 0
  },
  {
    value: "slightly-agree",
    text: "Slightly agree",
    redFlagScore: 0
  },
  {
    value: "slightly-disagree",
    text: "Slightly disagree",
    redFlagScore: 1
  },
  {
    value: "definitely-disagree",
    text: "Definitely disagree",
    redFlagScore: 1
  }
];
const asqAnswersShouldDisagree: Answer[] = [
  {
    value: "definitely-agree",
    text: "Definitely agree",
    redFlagScore: 1
  },
  {
    value: "slightly-agree",
    text: "Slightly agree",
    redFlagScore: 1
  },
  {
    value: "slightly-disagree",
    text: "Slightly disagree",
    redFlagScore: 0
  },
  {
    value: "definitely-disagree",
    text: "Definitely disagree",
    redFlagScore: 0
  }
];

const questionnaires: Questionnaire[] = [
  {
    id: "cdc6",
    title: "CDC 6 Months",
    category: "development",
    age_groups: { min: 6, max: 8 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "reach6",
        text: "Does your child try to get things that are in reach?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "affection6",
        text: "Does your child show affection to caregivers?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond_to_sounds6",
        text: "Does your child respond to sounds around them?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "difficulty_mouth6",
        text: "Does your child have difficulty getting things to their mouth?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "vowel_sounds6",
        text: "Can your child make vowel sounds? (“ah”, “eh”, “oh”)",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "roll6",
        text: "Can your child roll over in either direction?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "squealing6",
        text: "Does your child laugh or make squealing sounds?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "tight_muscles6",
        text:
          "Is your child stiff or show signs of tight muscles, or show symptoms of being very floppy or like a rag doll?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc9",
    title: "CDC 9 Months",
    category: "development",
    age_groups: { min: 9, max: 11 },
    remind_at: 9,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "bear_weight",
        text: "Can your child bear weight on their legs with support?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "sit_without_help",
        text: "Can your child sit without help?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "babbles",
        text: 'Does your child babble (e.g. "mama", "baba", "dada")?',
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "back_and_forth",
        text: "Does your child play any games involving back-and-forth play?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "responds_to_own_name",
        text: "Does your child respond to their own name?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "recognise_familiar_people",
        text: "Does your child recognise familiar people?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "looks_where_you_point",
        text: "Does your child look where you point?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "can_transfer_toys",
        text: "Can your child transfer toys from one hand to another?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        text: "Has your child lost any skills they once had?",
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc12",
    title: "CDC 12 Months",
    category: "development",
    age_groups: { min: 12, max: 17 },
    remind_at: 12,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "crawl",
        text: "Does your child crawl?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "stand",
        text: "Can your child stand when being supported?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "search_hidden",
        text: "Does your child search for things that they see you hide?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "single_words",
        text: 'Does your child say single words like "mama" or "dada"?',
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "gestures",
        text: "Does your child use gestures like waving or shaking their head?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "point",
        text: "Does your child point to things?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        text: "Has your child lost any skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc18",
    title: "CDC 18 Months",
    category: "development",
    age_groups: { min: 18, max: 23 },
    remind_at: 18,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "point18",
        text: "Does your child point to show things to others?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk18",
        text: "Can your child walk?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "know_familiar18",
        text:
          "Does your child know what familiar things are for (e.g. a spoon is for eating)?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_others18",
        text: "Does your child copy others?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "words18",
        text: "Does your child have at least 6 words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "learn_words18",
        text: "Is your child learning new words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "notice_carer18",
        text:
          "Does your child notice or mind when a caregiver leaves or returns?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills18",
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc24",
    title: "CDC 24 Months",
    category: "development",
    age_groups: { min: 24, max: 35 },
    remind_at: 24,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "two_word_phrases24",
        text: "Does your child use two word phrases (e.g. “drink milk”)?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "common_things24",
        text:
          "Does your child know what to do with common things, like a brush, phone, fork, spoon?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_actions24",
        text: "Does your child copy actions and words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "simple_instructions24",
        text: "Can your child follow simple instructions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk_steady24",
        text: "Does your child walk steadily without assistance?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills24",
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc36",
    title: "CDC 36 Months",
    category: "development",
    age_groups: { min: 36, max: 47 },
    remind_at: 36,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "fall_down36",
        text:
          "Does your child fall down a lot or have a lot of trouble with stairs?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "drool36",
        text: "Does your child drool or have very unclear speech?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "struggle36",
        text:
          "Does your child struggle to work out simple toys? (such as peg boards, simple puzzles, turning handles)?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "speak36",
        text: "Does your child speak in sentences?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "instructions36",
        text: "Does your child understand simple instructions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "pretend36",
        text: "Does your child play pretend or make believe?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "toys36",
        text: "Does your child want to play with other children or with toys?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "eye_contact36",
        text: "Does your child make eye contact?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills36",
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc48",
    title: "CDC 48 Months",
    category: "development",
    age_groups: { min: 48, max: 59 },
    remind_at: 48,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "jump48",
        text: "Can your child jump in one place?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "scribbling48",
        text: "Can your child scribble?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games48",
        text:
          "Does your child show any interest in interactive games or make-believe games?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond48",
        text:
          "Does your child ignore other children or doesn’t respond to people outside the family?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "resist48",
        text: "Does your child resist dressing, sleeping and using the toilet?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "retell48",
        text: "Can your child retell a favourite story?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "follow48",
        text: "Can your child follow a 3-part command?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "same_different48",
        text: "Does your child understand “same” and “different”?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "me_you48",
        text: "Can your child use “me” and “you” correctly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "speak_unclearly48",
        text: "Does your child speak clearly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills48",
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc60",
    title: "CDC 60 Months",
    category: "development",
    age_groups: { min: 60, max: 72 },
    remind_at: 60,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "wide_emotions60",
        text: "Does your child show a wide amount of emotions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "extreme_behaviour60",
        text:
          "Does your child show extreme behaviour? (usually fearful, aggressive, shy or sad)",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "withdrawn60",
        text: "Is your child unusually withdrawn and not active?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "distracted60",
        text:
          "Is your child easily distracted, has trouble focusing on one activity for more than 5 minutes?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "respond60",
        text:
          "Does your child not respond to people, or respond only superficially?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "make_believe60",
        text:
          "Can your child tell the difference between what’s real and what’s make-believe?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games60",
        text: "Does your child play a variety of games and activities?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "names60",
        text: "Can your child give their first and last name?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "plurals60",
        text: "Is your child able to use plurals or past tense properly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "daily_activities60",
        text: "Does your child talk about daily activities or experiences?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "drawing60",
        text: "Does your child draw pictures?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "brush_dry_wash60",
        text:
          "Is your child able to brush teeth, wash and dry hands, or get undressed without help?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills60",
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "qchat",
    title: "QCHAT",
    category: "communication",
    age_groups: { min: 16, max: 30 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 3
    },
    questions: [
      {
        id: "lookatyou",
        text: "Does your child look at you when you call his/her name?",
        answers: [
          {
            value: "always",
            text: "always",
            redFlagScore: 0
          },
          {
            value: "usually",
            text: "usually",
            redFlagScore: 0
          },
          {
            value: "sometimes",
            text: "sometimes",
            redFlagScore: 1
          },
          {
            value: "rarely",
            text: "rarely",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "eyecontacteasiness",
        text: "How easy is it for you to get eye contact with your child?",
        answers: [
          {
            value: "veryeasy",
            text: "very easy",
            redFlagScore: 0
          },
          {
            value: "quiteeasy",
            text: "quite easy",
            redFlagScore: 0
          },
          {
            value: "quitedifficult",
            text: "quite difficult",
            redFlagScore: 1
          },
          {
            value: "verydifficult",
            text: "very difficult",
            redFlagScore: 1
          },
          {
            value: "impossible",
            text: "impossible",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "pointwant",
        text:
          "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 0
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 0
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "pointshareinterest",
        text:
          "Does your child point to share interest with you (e.g. pointing at an interesting sight)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 0
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 0
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "pretending",
        text:
          "Does your child pretend (e.g. care for dolls, talk on a toy phone)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 0
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 0
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "followlooking",
        text: "Does your child follow where you’re looking?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 0
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 0
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "comfort",
        text:
          "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them(e.g. stroking their hair, hugging them)?",
        answers: [
          {
            value: "always",
            text: "always",
            redFlagScore: 0
          },
          {
            value: "usually",
            text: "usually",
            redFlagScore: 0
          },
          {
            value: "sometimes",
            text: "sometimes",
            redFlagScore: 1
          },
          {
            value: "rarely",
            text: "rarely",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "firstwords",
        text: "Would you describe your child’s first words as:",
        answers: [
          {
            value: "verytypical",
            text: "very typical",
            redFlagScore: 0
          },
          {
            value: "quitetypical",
            text: "quite typical",
            redFlagScore: 0
          },
          {
            value: "slightlyunusual",
            text: "slightly unusual",
            redFlagScore: 1
          },
          {
            value: "veryunusual",
            text: "very unusual",
            redFlagScore: 1
          },
          {
            value: "nonverbal",
            text: "my child doesn’t speak",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "simplegestures",
        text: "Does your child use simple gestures (e.g. wave goodbye)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 0
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 0
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 1
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 1
          }
        ]
      },
      {
        id: "stareatnothing",
        text: "Does your child stare at nothing with no apparent purpose?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagScore: 1
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagScore: 1
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagScore: 1
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagScore: 0
          },
          {
            value: "never",
            text: "never",
            redFlagScore: 0
          }
        ]
      }
    ]
  },
  {
    id: "pdq1",
    title: "Psychological Development Questionnaire For Toddlers (PDQ1)",
    category: "communication",
    age_groups: { min: 30, max: 47 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 12
    },
    questions: [
      {
        id: "points-or-gestures",
        text: "My child points or gestures to show interest or get attention",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "unusual-responses",
        text:
          "My child has unusual or variable responses to sound (seems not to hear or is oversensitive or overreacts)",
        answers: pdqAnswersShouldBeRarely
      },

      {
        id: "smiles",
        text: "My child smiles or makes regular eye contact with others",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "responds-to-name",
        text: "My child responds to name when called",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "shows-interest",
        text: "My child shows interest in children at play",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "enjoys-handshake-peekaboo",
        text: "My child enjoys doing “handshake” or “peek-a-boo.”",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "relates-to-others",
        text:
          "My child relates to others by babbling, gesturing, talking or changing expressions",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "uses-3-or-more-words-regularly",
        text: "My child uses 3 or more words regularly and appropriately",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "speaks-in-phrases",
        text:
          "My child speaks in phrases (for example: want juice, go bye-bye, more candy, give please)",
        answers: pdqAnswersShouldBeOften
      },

      {
        id: "laughs-when-others-laugh",
        text: "My child laughs when others laugh",
        answers: pdqAnswersShouldBeOften
      }
    ]
  },
  {
    id: "asq10",
    title: "Autism Spectrum Quotient",
    category: "communication",
    age_groups: { min: 48, max: 72 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 7
    },
    questions: [
      {
        id: "notices-small-sounds",
        text: "S/he often notices small sounds when others do not",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "concentrates-on-whole-picture",
        text:
          "S/he usually concentrates more on the whole picture, rather than the small details",
        answers: asqAnswersShouldAgree
      },
      {
        id: "tracks-multiple-conversations",
        text:
          "In a social group, s/he can easily keep track of several different people’s conversations",
        answers: asqAnswersShouldAgree
      },
      {
        id: "goes-back-and-forth",
        text:
          "S/he finds it easy to go back and forth between different activities",
        answers: asqAnswersShouldAgree
      },
      {
        id: "doesnt-know-how-to-keep-convo-going",
        text:
          "S/he doesn’t know how to keep a conversation going with his/her peers",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "good-at-chit-chat",
        text: "S/he is good at social chit-chat",
        answers: asqAnswersShouldAgree
      },
      {
        id: "difficult-to-work-out-feelings",
        text:
          "When s/he is read a story, s/he finds it difficult to work out the character’s intentions or feelings",
        answers: asqAnswersShouldDisagree
      },
      {
        id: "enjoyed-pretending",
        text:
          "When s/he was in preschool, s/he used to enjoy playing games involving pretending with other children",
        answers: asqAnswersShouldAgree
      },
      {
        id: "easy-to-work-out-feelings",
        text:
          "S/he finds it easy to work out what someone is thinking or feeling just by looking at their face",
        answers: asqAnswersShouldAgree
      },
      {
        id: "hard-to-make-friends",
        text: "S/he finds it hard to make new friends",
        answers: asqAnswersShouldDisagree
      }
    ]
  },
  {
    id: "rqc",
    title: "Reporting Questionnaire for Children (RQC)",
    category: "communication",
    age_groups: { min: 31, max: 66 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1
    },
    questions: [
      {
        id: "behaviour",
        text:
          "Does the child show any difficulties with behaviour such as being overactive (e.g. cannot sit still) or lack attention and concentration (e.g. easily distracted and does not finish activities)?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "calming",
        text:
          "Does the child show difficulty in calming down or is it difficult to comfort the child?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "sleep",
        text: "Does the child have any sleep or related difficulty?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "worries",
        text:
          "Does the child suffer from frequent worries or fears or seem sad or unhappy for no good reason?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "disobedience",
        text:
          "Does the child frequently show lack of co-operation, disobedience, or is defiant and argumentative?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "fighting",
        text:
          "Does the child show frequent fighting or aggressive behaviour and show no regret?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "feeding",
        text: "Does the child have any feeding or related difficulty?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "learning",
        text:
          "Does the child have any difficulties with learning or appear to be behind for overall abilities as compared with other children of about the same age?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "friendships",
        text:
          "Does the child show no interest in friendships or nearly never play with other children or does not show concern for others?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "rituals",
        text:
          "Does the child engage in any repetitive behaviours or rituals and insist on things being done in a particular way?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  }
];

export default questionnaires;
