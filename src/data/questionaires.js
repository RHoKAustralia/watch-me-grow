'use strict';

import angular from 'angular';

export default [
  {
    "id": "12months",
    "title": "Development Milestone - 12 months old",
    "min_age": 365,
    "max_age": 540,
    "questions_groups": [
      {
        "id": "social_emotional",
        "title": "Social and Emotional",
        "questions": [
          {
            "id": "nervousness",
            "text": "Is shy or nervous with strangers",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "cries_when_alone",
            "text": "Cries when mum or dad leaves",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "favourite_thins",
            "text": "Has favourite things and people",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          }
        ]
      },
      {
        "id": "language",
        "title": "Language/Communication",
        "questions": [
          {
            "id": "responds",
            "text": "Responds to simple spoken requests",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "gestures",
            "text": "Uses simple gestures, like pointing, shaking head “no” or waving “bye-bye”",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "sounds",
            "text": "Makes sounds with changes in tone (sounds more like speech)",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "18months",
    "title": "Development Milestone - 18 months old",
    "min_age": 540,
    "max_age": 730,
    "questions_groups": [
      {
        "id": "social_emotional",
        "title": "Social and Emotional",
        "questions": [
          {
            "id": "play_wiht_others",
            "text": "Likes to hand things to others as play",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "temper",
            "text": "May have temper tantrums",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "strangers",
            "text": "May be afraid of strangers",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          }
        ]
      },
      {
        "id": "language",
        "title": "Language/Communication",
        "questions": [
          {
            "id": "words",
            "text": "Uses 5 – 10 words meaningfully",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "new_words",
            "text": "Understands new words each week",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          },
          {
            "id": "gestures",
            "text": "Says and shakes head “no”",
            "display_type": "button",
            "answers": [
              {
                "value": 1,
                "text": "Yes",
                "score": 1,
                "flag_immediately": true
              }
            ]
          }
        ]
      }
    ]
  }
]
