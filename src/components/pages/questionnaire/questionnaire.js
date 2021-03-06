import PropTypes from "prop-types";
import React from "react";
import Styles from "./questionnaire.scss";
import QuestionSwitcher from "./question-switcher/question-switcher";
import getQuestions from "wmg-common/questions";
import moment from "moment";

class Questionnaire extends React.Component {
    static propTypes = {
        results: PropTypes.object,
        details: PropTypes.object
    };

    state = {};

    UNSAFE_componentWillMount() {
        this.updateQuestions(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.updateQuestions(props);
    }

    updateQuestions = props => {
        if (this.props.details.babyDob && this.props.details.babyDob !== "") {
            const months = moment().diff(this.props.details.babyDob, "months");

            this.setState({
                questions: getQuestions(months, process.env.SUBSITE)
            });
        }
    };

    getQuestionNumber = () => {
        const questionNumber = parseInt(this.props.params.questionNumber);
        if (!Number.isNaN(questionNumber)) {
            return questionNumber;
        }
    };

    hasAnswered = () => {
        const questionNumber = this.getQuestionNumber();

        if (questionNumber) {
            const question = this.state.questions[questionNumber];
            return !!this.props.results.getAnswer(
                question.questionnaire.id,
                question.id
            );
        }

        return false;
    };

    render() {
        return (
            <div className={Styles.questionnaire}>
                <div className={Styles.inner}>
                    <QuestionSwitcher
                        questions={this.state.questions}
                        questionNumber={this.getQuestionNumber()}
                        hasAnswered={this.hasAnswered()}
                        details={this.props.details}
                        route={
                            this.props.routes[this.props.routes.length - 1].path
                        }
                    />
                    {React.Children.map(this.props.children, child =>
                        React.cloneElement(
                            child,
                            Object.assign({}, this.props, {
                                questions: this.state.questions,
                                questionNumber: this.getQuestionNumber()
                            })
                        )
                    )}
                </div>
            </div>
        );
    }
}

export default Questionnaire;
