'use strict';

import angular from 'angular';

export default [
  {
    "id": "qchat",
    "title": "QCHAT",
    "description": "Q-CHAT-10 (Quantitative Checklist for Autism in Toddlers) is a quick referral guide for parents to complete about their toddler (18 – 24 months) with concerns about autism.",
    "detail_link": "http://www.autismresearchcentre.com/arc_tests",
    "age_groups": ['18_month', '2_years'],
    "analysis": {
      "strategy": "simple",
      "redFlagThreshold": 3,
      "amberFlagThreshold": 99
    },
    "questions": [
      {
        "id": "lookatyou",
        "order": 0,
        "text": "Does your child look at you when you call his/her name?",
        "answers": [
          {
            "value": "always",
            "text": "always",
            "redFlagQuestion": false
          },
          {
            "value": "usually",
            "text": "usually",
            "redFlagQuestion": false
          },
          {
            "value": "sometimes",
            "text": "sometimes",
            "redFlagQuestion": true
          },
          {
            "value": "rarely",
            "text": "rarely",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "eyecontacteasiness",
        "order": 1,
        "text": "How easy is it for you to get eye contact with your child?",
        "answers": [
          {
            "value": "veryeasy",
            "text": "very easy",
            "redFlagQuestion": false
          },
          {
            "value": "quiteeasy",
            "text": "quite easy",
            "redFlagQuestion": false
          },
          {
            "value": "quitedifficult",
            "text": "quite difficult",
            "redFlagQuestion": true
          },
          {
            "value": "verydifficult",
            "text": "very difficult",
            "redFlagQuestion": true
          },
          {
            "value": "impossible",
            "text": "impossible",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "pointwant",
        "order": 2,
        "text": "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "pointshareinterest",
        "order": 3,
        "text": "Does your child point to share interest with you (e.g. pointing at an interesting sight)?",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "pretending",
        "order": 4,
        "text": "Does your child pretend (e.g. care for dolls, talk on a toy phone)?",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "followlooking",
        "order": 5,
        "text": "Does your child follow where you’re looking?",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "comfort",
        "order": 6,
        "text": "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them(e.g. stroking their hair, hugging them)?",
        "answers": [
          {
            "value": "always",
            "text": "always",
            "redFlagQuestion": false
          },
          {
            "value": "usually",
            "text": "usually",
            "redFlagQuestion": false
          },
          {
            "value": "sometimes",
            "text": "sometimes",
            "redFlagQuestion": true
          },
          {
            "value": "rarely",
            "text": "rarely",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "firstwords",
        "order": 7,
        "text": "Would you describe your child’s first words as:",
        "answers": [
          {
            "value": "verytypical",
            "text": "very typical",
            "redFlagQuestion": false
          },
          {
            "value": "quitetypical",
            "text": "quite typical",
            "redFlagQuestion": false
          },
          {
            "value": "slightlyunusual",
            "text": "slightly unusual",
            "redFlagQuestion": true
          },
          {
            "value": "veryunusual",
            "text": "very unusual",
            "redFlagQuestion": true
          },
          {
            "value": "nonverbal",
            "text": "my child doesn’t speak",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "simplegestures",
        "order": 8,
        "text": "Does your child use simple gestures (e.g. wave goodbye)?",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": false
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": true
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "stareatnothing",
        "order": 9,
        "text": "Does your child stare at nothing with no apparent purpose?",
        "answers": [
          {
            "value": "manyday",
            "text": "many times a day",
            "redFlagQuestion": true
          },
          {
            "value": "fewday",
            "text": "a few times a day",
            "redFlagQuestion": true
          },
          {
            "value": "fewweek",
            "text": "a few times a week",
            "redFlagQuestion": true
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week",
            "redFlagQuestion": false
          },
          {
            "value": "never",
            "text": "never",
            "redFlagQuestion": false
          }
        ]
      }
    ]
  },
  {
    "id": "peds",
    "title": "PEDS",
    "description": "Parents’ Evaluation of Developmental Status (PEDS) (developed by Glascoe FP)  is included in the My Personal Health Record.",
    "detail_link": "http://www.kidsfamilies.health.nsw.gov.au/publications/child-personal-health-record-(blue-book)/",
    "age_groups": ['6_month', '12_month', '18_month', '2_years', '3_years', '4_years'],
    "analysis": {
      "strategy": "simple",
      "redFlagThreshold": 3,
      "amberFlagThreshold": 99
    },
    "questions": [
      {
        "id": "conerncs",
        "order": 0,
        "text": "Do you have any concerns about your child’s learning, development or behaviour? Please describe",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },

      {
        "id": "speech_sound",
        "order": 1,
        "text": "Do you have any concerns about how your child talks and makes speech sounds?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "understand_speech",
        "order": 2,
        "text": "Do you have any concerns about how your child understands what you say?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "using_hand",
        "order": 3,
        "text": "Do you have any concerns about how your child uses his / her hands and fingers to do things?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "using_arm_leg",
        "order": 4,
        "text": "Do you have any concerns about how your child uses his / her arms and legs?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "behaviour",
        "order": 5,
        "text": "Do you have any concerns about how your child behaves?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "getting_along",
        "order": 6,
        "text": "Do you have any concerns about how your child gets along with others?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "learning",
        "order": 7,
        "text": "Do you have any concerns about how your child is learning to do things for themselves?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "learning_at_preschool",
        "order": 8,
        "text": "Do you have any concerns about how your child is learning preschool or school skills?",
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      },
      {
        "id": "other_concerns",
        "order": 9,
        "text": "Any other concerns? (like Hearing, Vision, Physical health, Weight, ???)", //TODO
        "answers": [
          {
            "value": "no",
            "text": "No",
            "redFlagQuestion": false
          },
          {
            "value": "alittle",
            "text": "A little",
            "amberFlagQuestion": true
          },
          {
            "value": "yes",
            "text": "Yes",
            "redFlagQuestion": true
          }
        ]
      }
    ]
  }
]

