import React from "react";
import i18next from "i18next";
import { Translation } from "react-i18next";

import { mark, combineAll, anyConcerns } from "src/common/data-functions";
import getQuestions from "src/common/questions";
import { RecordedAnswer } from "src/common/notify-function-input";
import { getConfigByHost } from "src/common/site-specific-config";

const LOCAL_STORAGE_KEY = "wmg-results";

type State = {
  [questionnaireId: string]: {
    [questionId: string]: RecordedAnswer;
  };
} & {
  concerns?: { [category: string]: boolean };
};

export type Results = State & {
  getResultsForQuestionnaire: (
    questionnaireId: string
  ) => { [questionId: string]: RecordedAnswer };
  getAnswer: (questionnaireId: string, questionId: string) => RecordedAnswer;
  setAnswer: (
    questionnaireId: string,
    questionId: string,
    value: any,
    comments?: string
  ) => void;
  save: () => void;
  mark: () => void;
  clear: () => void;
  isComplete: (ageInMonths: number) => boolean;
  anyConcerns: () => boolean;
};

export type WrappedComponentProps = {
  results: Results;
};
const ResultStore = <T extends WrappedComponentProps>(
  ComposedComponent: React.ComponentClass<T, any>
) =>
  class ResultStore extends React.Component<T, State> {
    state: State = {};

    componentDidMount() {
      const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

      this.setState(resultsString ? JSON.parse(resultsString) : {});
    }

    setAnswer = (
      questionnaireId: string,
      questionId: string,
      value: any,
      comments?: string
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

    mark = (t: i18next.TFunction) => () => {
      this.setState({ concerns: mark(combineAll(this.state, t)) });
    };

    clear = () => {
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      this.setState(
        Object.keys(this.state).reduce((acc: State, id: string) => {
          const newState: State = {
            ...acc,
            [id]: (undefined as any) as { [id: string]: RecordedAnswer }
          };
          return newState;
        }, {} as State)
      );
    };

    isComplete = (ageInMonths: number) => {
      const questions = getQuestions(
        ageInMonths,
        getConfigByHost(window.location.hostname)!
      );

      return Object.keys(questions).every(index => {
        const question = questions[parseInt(index)];
        return !!this.getAnswer(
          question.questionnaire.id,
          question.question.id
        );
      });
    };

    anyConcerns = () => {
      return this.state.concerns ? anyConcerns(this.state.concerns) : false;
    };

    render() {
      return (
        <Translation ns={["default"]}>
          {t => {
            const results: Results = Object.assign({}, this.state, {
              getResultsForQuestionnaire: this.getResultsForQuestionnaire,
              getAnswer: this.getAnswer,
              setAnswer: this.setAnswer,
              save: this.save,
              mark: this.mark(t),
              clear: this.clear,
              isComplete: this.isComplete,
              anyConcerns: this.anyConcerns
            });

            return <ComposedComponent {...this.props} results={results} />;
          }}
        </Translation>
      );
    }
  };

export default ResultStore;
