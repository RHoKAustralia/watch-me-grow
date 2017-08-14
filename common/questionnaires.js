module.exports = [
  {
    id: "qchat",
    title: "QCHAT",
    description:
      "Q-CHAT-10 (Quantitative Checklist for Autism in Toddlers) is a quick referral guide for parents to complete about their toddler (18 – 24 months) with concerns about autism.",
    introduction:
      "Some questions about your child’s speech and socialising skills. Please answer all questions.",
    detail_link: "http://www.autismresearchcentre.com/arc_tests",
    age_groups: { min: 0, max: 65536 }, // was: "age_groups": ['18_month', '2_years'],
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
    id: "cdc12", // "12 Month items from file "New qns.docx" - numbered 1-7 in that document but 0-6 here
    title: "CDC",
    description: "DESCRIPTION FOR CDC QUESTIONS TO GO HERE",
    introduction: "INTRODUCTION FOR CDC MATERIAL TO GO HERE",
    detail_link: "DETAIL LINK TO GO HERE",
    age_groups: { min: 9, max: 15 },
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      // Numbers
      {
        id: "crawl",
        order: 0, // table 1 question 1
        text: "Does your child crawl?", // fixme
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "stand",
        order: 1,
        text: "Can your child stand when being supported?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "search_hidden",
        order: 2,
        text: "Does your child search for things that they see you hide?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "single_words",
        order: 3,
        text: 'Does your child say single words like "mama" or "dada"?',
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "gestures",
        order: 4,
        text: "Does your child use gestures like waving or shaking their head?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "point",
        order: 5,
        text: "Does your child point to things?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "lost_skills",
        order: 6,
        text: "Has your child lost any skills they once had?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes",
            redFlagQuestion: true
          },
          {
            value: "no",
            text: "No",
          },
          {
            value: "notsure",
            text: "Not Sure",
            redFlagQuestion: true
          }
        ]
      }
    ]
  },
  {
    id: "cdc18", // "18 Month items from file "New qns.docx" - numbered 8-15 in that document but 0-6 here
    title: "CDC",
    description: "DESCRIPTION FOR CDC QUESTIONS TO GO HERE",
    introduction: "INTRODUCTION FOR CDC MATERIAL TO GO HERE",
    detail_link: "DETAIL LINK TO GO HERE",
    age_groups: { min: 16, max: 21 },
    remind_at: 18,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      // Numbers
      {
        id: "point18",
        order: 0, // table 1 question 1
        text: "Does your child point to show things to others?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes",
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "walk18",
        order: 1,
        text: "Can your child walk?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "know_familiar18",
        order: 2,
        text:
          "Does your child know what familiar things are for (e.g. a spoon is for eating)?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "copy_others18",
        order: 3,
        text: "Does your child copy others?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "words18",
        order: 4,
        text: "Does your child have at least 6 words?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "learn_words18",
        order: 5,
        text: "Is your child learning new words?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "notice_carer18",
        order: 6,
        text:
          "Does your child notice or mind when a caregiver leaves or returns?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "lost_skills18",
        order: 7,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes",
            redFlagQuestion: true
          },
          {
            value: "no",
            text: "No",
          },
          {
            value: "notsure",
            text: "Not Sure",
            redFlagQuestion: true
          }
        ]
      }
    ]
  },
  {
    id: "cdc24", // "24 Month items from file "New qns.docx" - numbered 16-21 in that document but 0-5 here
    title: "CDC",
    description: "DESCRIPTION FOR CDC QUESTIONS TO GO HERE",
    introduction: "INTRODUCTION FOR CDC MATERIAL TO GO HERE",
    detail_link: "DETAIL LINK TO GO HERE",
    age_groups: { min: 21, max: 27 },
    remind_at: 24,
    analysis: {
      strategy: "cdc",
      redFlagThreshold: 1,
      amberFlagThreshold: 1
    },
    questions: [
      // Numbers
      {
        id: "two_word_phrases24",
        order: 0, // table 1 question 1
        text: "Does your child use two word phrases (e.g. “drink milk”)?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "common_things24",
        order: 1,
        text:
          "Does your child know what to do with common things, like a brush, phone, fork, spoon?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "copy_actions24",
        order: 2,
        text: "Does your child copy actions and words?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "simple_instructions24",
        order: 3,
        text: "Can your child follow simple instructions?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "walk_steady24",
        order: 4,
        text: "Does your child walk steadily without assistance?",
        comments: false,
        answers: [
          {
            value: "yes",
            text: "Yes"
          },
          {
            value: "no",
            text: "No",
            amberFlagQuestion: true
          },
          {
            value: "notsure",
            text: "Not Sure",
            amberFlagQuestion: true
          }
        ]
      },
      {
        id: "lost_skills24",
        order: 5,
        text: "Has your child lost skills they once had?",
        comments: false,
        answers: [
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
        ]
      }
    ]
  }
];
