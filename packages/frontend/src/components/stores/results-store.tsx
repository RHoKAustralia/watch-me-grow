import React from "react";

import {
  mark,
  combineAll,
  combineQuestionsAndAnswers,
  getOverallResult
} from "@wmg/common/lib/data-functions";
import questionnaires from "@wmg/common/lib/questionnaires";
import getQuestions from "@wmg/common/lib/questions";
import { RecordedAnswer } from "@wmg/common/lib/notify-function-input";
import subsite from "../../util/subsite";

const LOCAL_STORAGE_KEY = "wmg-results";

type State = {
  [questionnaireId: string]: {
    [questionId: string]: RecordedAnswer;
  };
} & {
  concern?: boolean;
};

export type Results = State & {
  getResultsForQuestionnaire: (questionnaireId: string) => any;
  getAnswer: (questionnaireId: string, questionId: string) => any;
  setAnswer: (
    questionnaireId: string,
    questionId: string,
    value: any,
    comments: string
  ) => void;
  save: () => void;
  mark: () => void;
  clear: () => void;
  isComplete: (ageInMonths: number) => boolean;
};

export type WrappedComponentProps = {
  results: Results;
};
const ResultStore = <T extends WrappedComponentProps>(
  ComposedComponent: React.ComponentClass<T, any>
) =>
  class ResultStore extends React.Component<T, State> {
    state: State = {};

    UNSAFE_componentWillMount() {
      const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

      this.setState(resultsString ? JSON.parse(resultsString) : {});
    }

    setAnswer = (
      questionnaireId: string,
      questionId: string,
      value: any,
      comments: string
    ) => {
      const forQuestionnaire = this.getResultsForQuestionnaire(questionnaireId);

      forQuestionnaire[questionId] = { value, comments } as RecordedAnswer;

      this.setState({
        [questionnaireId]: forQuestionnaire
      });
    };

    getResultsForQuestionnaire = (
      questionnaireId: string
    ): { [questionId: string]: RecordedAnswer } => {
      const questionnaire = this.state[questionnaireId];

      return questionnaire ? questionnaire : {};
    };

    save = () => {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    };

    getAnswer = (
      questionnaireId: string,
      questionId: string
    ): RecordedAnswer => {
      return this.getResultsForQuestionnaire(questionnaireId)[questionId];
    };

    mark = () => {
      this.setState({ concern: mark(combineAll(this.state)) });
    };

    clear = () => {
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      this.setState(
        Object.keys(this.state).reduce(
          (acc: State, id: string) => {
            const newState: State = {
              ...acc,
              [id]: (undefined as any) as { [id: string]: RecordedAnswer }
            };
            return newState;
          },
          {} as State
        )
      );
    };

    isComplete = (ageInMonths: number) => {
      const questions = getQuestions(ageInMonths, subsite!);

      return Object.keys(questions).every(index => {
        const question = questions[parseInt(index)];
        return !!this.getAnswer(
          question.questionnaire.id,
          question.question.id
        );
      });
    };

    render() {
      const results: Results = Object.assign({}, this.state, {
        getResultsForQuestionnaire: this.getResultsForQuestionnaire,
        getAnswer: this.getAnswer,
        setAnswer: this.setAnswer,
        save: this.save,
        mark: this.mark,
        clear: this.clear,
        isComplete: this.isComplete
      });

      return <ComposedComponent {...this.props} results={results} />;
    }
  };

export default ResultStore;
