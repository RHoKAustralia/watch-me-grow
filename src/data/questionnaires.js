'use strict';

import angular from 'angular';

export default [
  {
    "id": "qchat",
    "title": "QCHAT",
    "age_groups": ['18_month', '2_years'],
    "questions": [
      {
        "id": "lookatyou",
        "order": 0,
        "text": "Does your child look at you when you call his/her name?",
        "answers": [
          {
            "value": "always",
            "text": "always"
          },
          {
            "value": "usually",
            "text": "usually"
          },
          {
            "value": "sometimes",
            "text": "sometimes"
          },
          {
            "value": "rarely",
            "text": "rarely"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "very easy"
          },
          {
            "value": "quiteeasy",
            "text": "quite easy"
          },
          {
            "value": "quitedifficult",
            "text": "quite difficult"
          },
          {
            "value": "verydifficult",
            "text": "very difficult"
          },
          {
            "value": "impossible",
            "text": "impossible"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "always"
          },
          {
            "value": "usually",
            "text": "usually"
          },
          {
            "value": "sometimes",
            "text": "sometimes"
          },
          {
            "value": "rarely",
            "text": "rarely"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "very typical"
          },
          {
            "value": "quitetypical",
            "text": "quite typical"
          },
          {
            "value": "slightlyunusual",
            "text": "slightly unusual"
          },
          {
            "value": "veryunusual",
            "text": "very unusual"
          },
          {
            "value": "nonverbal",
            "text": "my child doesn’t speak"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
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
            "text": "many times a day"
          },
          {
            "value": "fewday",
            "text": "a few times a day"
          },
          {
            "value": "fewweek",
            "text": "a few times a week"
          },
          {
            "value": "lessonceweek",
            "text": "less than once a week"
          },
          {
            "value": "never",
            "text": "never"
          }
        ]
      }
    ]
  }
]
//"id": "peds",
//"title": "PEDS",
//"age_groups": ['6_month', '12_month', '18_month', '2_years', '3_years', '4_years'],
//questionnaire: [
//    {
//      "id": "favourite_thins",
//      "text": "Has favourite things and people",
//      "display_type": "button",
//      "answers": [
//        {
//          "value": 1,
//          "text": "Yes",
//          "score": 1,
//          "flag_immediately": true
//        }
//      ]
//    }
//  ]
//},