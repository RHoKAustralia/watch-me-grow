import React, { ReactNode, useState, useEffect } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import Styles from "./question-wrapper.module.scss";

import QuestionSwitcher from "./question-switcher/question-switcher";
import getQuestions from "src/frontend/data/questions";
import { QuestionLookup } from "src/common/questions";
import { Details } from "src/frontend/components/stores/details-store";
import { Results } from "src/frontend/components/stores/results-store";

type Props = {
  details: Details;
  results: Results;
  children: (questions?: QuestionLookup, questionNumber?: number) => ReactNode;
} & WithRouterProps;

function QuestionWrapper(props: Props) {
  const [questions, setQuestions] = useState<undefined | QuestionLookup>(
    props.details.babyDob && getQuestions(props.details.ageInMonths())
  );

  useEffect(() => {
    setQuestions(
      props.details.babyDob && getQuestions(props.details.ageInMonths())
    );
  }, [props.details.babyDob]);

  const getQuestionNumber = () => {
    const questionNumber = props.router.query.questionNumber
      ? parseInt(
          Array.isArray(props.router.query.questionNumber)
            ? props.router.query.questionNumber[0]
            : props.router.query.questionNumber
        )
      : undefined;
    if (questionNumber && !Number.isNaN(questionNumber)) {
      return questionNumber;
    } else {
      return 0;
    }
  };

  const hasAnswered = () => {
    const questionNumber = getQuestionNumber();

    if (questionNumber && questions) {
      const question = questions[questionNumber];
      return !!props.results.getAnswer(
        question.questionnaire.id,
        question.question.id
      );
    }

    return false;
  };

  return (
    <div className={Styles.questionnaire}>
      <div className={Styles.inner}>
        <QuestionSwitcher
          questions={questions}
          questionNumber={getQuestionNumber()}
          hasAnswered={hasAnswered()}
          details={props.details}
        />
        {props.children(questions, getQuestionNumber())}
      </div>
    </div>
  );
}

export default withRouter(QuestionWrapper);
