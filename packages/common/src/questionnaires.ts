export type Answer = {
  value: string;
  text: string;
  redFlagQuestion?: boolean;
  amberFlagQuestion?: boolean;
};

export type Question = {
  id: string;
  order: number;
  text: string;
  comments?: boolean;
  answers: Answer[];
};

export type Questionnaire = {
  id: string;
  title: string;
  age_groups: {
    min: number;
    max: number;
  };
  analysis: {
    strategy: string;
    redFlagThreshold: number;
    amberFlagThreshold: number;
  };
  remind_at?: number;
  questions: Question[];
};

const cdcShouldBeYesAnswer = [
  {
    value: "yes",
    text: "Yes"
  },
  {
    value: "no",
    text: "No",
    redFlagQuestion: true
  },
  {
    value: "notsure",
    text: "Not Sure",
    redFlagQuestion: true
  }
];

const cdcShouldBeNoAnswer = [
  {
    value: "yes",
    text: "Yes",
    redFlagQuestion: true
  },
  {
    value: "no",
    text: "No"
  },
  {
    value: "notsure",
    text: "Not Sure",
    redFlagQuestion: true
  }
];

const questionnaires: Questionnaire[] = [
  {
    id: "cdc6",
    title: "CDC 6 Months",
    age_groups: { min: 6, max: 8 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "reach6",
        order: 0,
        text: "Does your child try to get things that are in reach?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "affection6",
        order: 1,
        text: "Does your child show affection to caregivers?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond_to_sounds6",
        order: 2,
        text: "Does your child respond to sounds around them?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "difficulty_mouth6",
        order: 3,
        text: "Does your child have difficulty getting things to their mouth?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "vowel_sounds6",
        order: 4,
        text: "Can your child make vowel sounds? (“ah”, “eh”, “oh”)",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "roll6",
        order: 5,
        text: "Can your child roll over in either direction?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "squealing6",
        order: 6,
        text: "Does your child laugh or make squealing sounds?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "tight_muscles6",
        order: 7,
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
    age_groups: { min: 9, max: 11 },
    remind_at: 9,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "bear_weight",
        order: 0,
        text: "Can your child bear weight on their legs with support?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "sit_without_help",
        order: 1,
        text: "Can your child sit without help?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "babbles",
        order: 2,
        text: 'Does your child babble (e.g. "mama", "baba", "dada")?',
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "back_and_forth",
        order: 3,
        text: "Does your child play any games involving back-and-forth play?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "responds_to_own_name",
        order: 4,
        text: "Does your child respond to their own name?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "recognise_familiar_people",
        order: 5,
        text: "Does your child recognise familiar people?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "looks_where_you_point",
        order: 6,
        text: "Does your child look where you point?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "can_transfer_toys",
        order: 7,
        text: "Can your child transfer toys from one hand to another?",
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        order: 8,
        text: "Has your child lost any skills they once had?",
        answers: cdcShouldBeNoAnswer
      }
    ]
  },

  {
    id: "cdc12",
    title: "CDC 12 Months",
    age_groups: { min: 12, max: 17 },
    remind_at: 12,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "crawl",
        order: 0,
        text: "Does your child crawl?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "stand",
        order: 1,
        text: "Can your child stand when being supported?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "search_hidden",
        order: 2,
        text: "Does your child search for things that they see you hide?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "single_words",
        order: 3,
        text: 'Does your child say single words like "mama" or "dada"?',
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "gestures",
        order: 4,
        text: "Does your child use gestures like waving or shaking their head?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "point",
        order: 5,
        text: "Does your child point to things?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills",
        order: 6,
        text: "Has your child lost any skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc18",
    title: "CDC 18 Months",
    age_groups: { min: 18, max: 23 },
    remind_at: 18,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "point18",
        order: 0,
        text: "Does your child point to show things to others?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk18",
        order: 1,
        text: "Can your child walk?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "know_familiar18",
        order: 2,
        text:
          "Does your child know what familiar things are for (e.g. a spoon is for eating)?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_others18",
        order: 3,
        text: "Does your child copy others?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "words18",
        order: 4,
        text: "Does your child have at least 6 words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "learn_words18",
        order: 5,
        text: "Is your child learning new words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "notice_carer18",
        order: 6,
        text:
          "Does your child notice or mind when a caregiver leaves or returns?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills18",
        order: 7,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc24",
    title: "CDC 24 Months",
    age_groups: { min: 24, max: 35 },
    remind_at: 24,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "two_word_phrases24",
        order: 0,
        text: "Does your child use two word phrases (e.g. “drink milk”)?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "common_things24",
        order: 1,
        text:
          "Does your child know what to do with common things, like a brush, phone, fork, spoon?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "copy_actions24",
        order: 2,
        text: "Does your child copy actions and words?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "simple_instructions24",
        order: 3,
        text: "Can your child follow simple instructions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "walk_steady24",
        order: 4,
        text: "Does your child walk steadily without assistance?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills24",
        order: 5,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc36",
    title: "CDC 36 Months",
    age_groups: { min: 36, max: 47 },
    remind_at: 36,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "fall_down36",
        order: 0,
        text:
          "Does your child fall down a lot or have a lot of trouble with stairs?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "drool36",
        order: 1,
        text: "Does your child drool or have very unclear speech?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "struggle36",
        order: 2,
        text:
          "Does your child struggle to work out simple toys? (such as peg boards, simple puzzles, turning handles)?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "speak36",
        order: 3,
        text: "Does your child speak in sentences?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "instructions36",
        order: 4,
        text: "Does your child understand simple instructions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "pretend36",
        order: 5,
        text: "Does your child play pretend or make believe?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "toys36",
        order: 6,
        text: "Does your child want to play with other children or with toys?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "eye_contact36",
        order: 7,
        text: "Does your child make eye contact?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills36",
        order: 8,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc48",
    title: "CDC",
    age_groups: { min: 48, max: 59 },
    remind_at: 48,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "jump48",
        order: 0,
        text: "Can your child jump in one place?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "scribbling48",
        order: 1,
        text: "Can your child scribble?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games48",
        order: 2,
        text:
          "Does your child show any interest in interactive games or make-believe games?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "respond48",
        order: 3,
        text:
          "Does your child ignore other children or doesn’t respond to people outside the family?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "resist48",
        order: 4,
        text: "Does your child resist dressing, sleeping and using the toilet?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "retell48",
        order: 5,
        text: "Can your child retell a favourite story?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "follow48",
        order: 6,
        text: "Can your child follow a 3-part command?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "same_different48",
        order: 7,
        text: "Does your child understand “same” and “different”?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "me_you48",
        order: 8,
        text: "Can your child use “me” and “you” correctly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "speak_unclearly48",
        order: 9,
        text: "Does your child speak clearly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills48",
        order: 10,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "cdc60",
    title: "CDC",
    age_groups: { min: 60, max: 66 },
    remind_at: 60,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "wide_emotions60",
        order: 0,
        text: "Does your child show a wide amount of emotions?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "extreme_behaviour60",
        order: 1,
        text:
          "Does your child show extreme behaviour? (usually fearful, aggressive, shy or sad)",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "withdrawn60",
        order: 2,
        text: "Is your child unusually withdrawn and not active?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "distracted60",
        order: 3,
        text:
          "Is your child easily distracted, has trouble focusing on one activity for more than 5 minutes?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "respond60",
        order: 4,
        text:
          "Does your child not respond to people, or respond only superficially?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "make_believe60",
        order: 5,
        text:
          "Can your child tell the difference between what’s real and what’s make-believe?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "games60",
        order: 6,
        text: "Does your child play a variety of games and activities?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "names60",
        order: 7,
        text: "Can your child give their first and last name?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "plurals60",
        order: 8,
        text: "Is your child able to use plurals or past tense properly?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "daily_activities60",
        order: 9,
        text: "Does your child talk about daily activities or experiences?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "drawing60",
        order: 10,
        text: "Does your child draw pictures?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "brush_dry_wash60",
        order: 11,
        text:
          "Is your child able to brush teeth, wash and dry hands, or get undressed without help?",
        comments: false,
        answers: cdcShouldBeYesAnswer
      },
      {
        id: "lost_skills60",
        order: 12,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  },
  {
    id: "qchat",
    title: "QCHAT",
    age_groups: { min: 16, max: 30 },
    analysis: {
      strategy: "simple",
      redFlagThreshold: 3,
      amberFlagThreshold: 99
    },
    questions: [
      {
        id: "lookatyou",
        order: 0,
        text: "Does your child look at you when you call his/her name?",
        answers: [
          {
            value: "always",
            text: "always",
            redFlagQuestion: false
          },
          {
            value: "usually",
            text: "usually",
            redFlagQuestion: false
          },
          {
            value: "sometimes",
            text: "sometimes",
            redFlagQuestion: true
          },
          {
            value: "rarely",
            text: "rarely",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "eyecontacteasiness",
        order: 1,
        text: "How easy is it for you to get eye contact with your child?",
        answers: [
          {
            value: "veryeasy",
            text: "very easy",
            redFlagQuestion: false
          },
          {
            value: "quiteeasy",
            text: "quite easy",
            redFlagQuestion: false
          },
          {
            value: "quitedifficult",
            text: "quite difficult",
            redFlagQuestion: true
          },
          {
            value: "verydifficult",
            text: "very difficult",
            redFlagQuestion: true
          },
          {
            value: "impossible",
            text: "impossible",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "pointwant",
        order: 2,
        text:
          "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: false
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: false
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "pointshareinterest",
        order: 3,
        text:
          "Does your child point to share interest with you (e.g. pointing at an interesting sight)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: false
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: false
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "pretending",
        order: 4,
        text:
          "Does your child pretend (e.g. care for dolls, talk on a toy phone)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: false
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: false
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "followlooking",
        order: 5,
        text: "Does your child follow where you’re looking?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: false
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: false
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "comfort",
        order: 6,
        text:
          "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them(e.g. stroking their hair, hugging them)?",
        answers: [
          {
            value: "always",
            text: "always",
            redFlagQuestion: false
          },
          {
            value: "usually",
            text: "usually",
            redFlagQuestion: false
          },
          {
            value: "sometimes",
            text: "sometimes",
            redFlagQuestion: true
          },
          {
            value: "rarely",
            text: "rarely",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "firstwords",
        order: 7,
        text: "Would you describe your child’s first words as:",
        answers: [
          {
            value: "verytypical",
            text: "very typical",
            redFlagQuestion: false
          },
          {
            value: "quitetypical",
            text: "quite typical",
            redFlagQuestion: false
          },
          {
            value: "slightlyunusual",
            text: "slightly unusual",
            redFlagQuestion: true
          },
          {
            value: "veryunusual",
            text: "very unusual",
            redFlagQuestion: true
          },
          {
            value: "nonverbal",
            text: "my child doesn’t speak",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "simplegestures",
        order: 8,
        text: "Does your child use simple gestures (e.g. wave goodbye)?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: false
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: false
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: true
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: true
          }
        ]
      },
      {
        id: "stareatnothing",
        order: 9,
        text: "Does your child stare at nothing with no apparent purpose?",
        answers: [
          {
            value: "manyday",
            text: "many times a day",
            redFlagQuestion: true
          },
          {
            value: "fewday",
            text: "a few times a day",
            redFlagQuestion: true
          },
          {
            value: "fewweek",
            text: "a few times a week",
            redFlagQuestion: true
          },
          {
            value: "lessonceweek",
            text: "less than once a week",
            redFlagQuestion: false
          },
          {
            value: "never",
            text: "never",
            redFlagQuestion: false
          }
        ]
      }
    ]
  },
  {
    id: "rqc",
    title: "Reporting Questionnaire for Children (RQC)",
    age_groups: { min: 31, max: 66 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      {
        id: "behaviour",
        order: 0,
        text:
          "Does the child show any difficulties with behaviour such as being overactive (e.g. cannot sit still) or lack attention and concentration (e.g. easily distracted and does not finish activities)?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "calming",
        order: 1,
        text:
          "Does the child show difficulty in calming down or is it difficult to comfort the child?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "sleep",
        order: 2,
        text: "Does the child have any sleep or related difficulty?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "worries",
        order: 3,
        text:
          "Does the child suffer from frequent worries or fears or seem sad or unhappy for no good reason?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "disobedience",
        order: 4,
        text:
          "Does the child frequently show lack of co-operation, disobedience, or is defiant and argumentative?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "fighting",
        order: 5,
        text:
          "Does the child show frequent fighting or aggressive behaviour and show no regret?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "feeding",
        order: 6,
        text: "Does the child have any feeding or related difficulty?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "learning",
        order: 7,
        text:
          "Does the child have any difficulties with learning or appear to be behind for overall abilities as compared with other children of about the same age?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "friendships",
        order: 8,
        text:
          "Does the child show no interest in friendships or nearly never play with other children or does not show concern for others?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      },
      {
        id: "rituals",
        order: 9,
        text:
          "Does the child engage in any repetitive behaviours or rituals and insist on things being done in a          particular way?",
        comments: false,
        answers: cdcShouldBeNoAnswer
      }
    ]
  }
];

export default questionnaires;
