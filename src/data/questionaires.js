'use strict';

import angular from 'angular';

export default [
  {
    "id": "qchat",
    "title": "QCHAT",
    "age_groups": ['18_month', '2_years'],
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
    "id": "peds",
    "title": "PEDS",
    "age_groups": ['6_month', '12_month', '18_month', '2_years', '3_years', '4_years'],
    questions: [
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
  }
]
