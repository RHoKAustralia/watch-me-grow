import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { withRouter } from 'react-router';

import Styles from './details.scss';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';

const minDate = moment().subtract(4, 'years');
const maxDate = moment().subtract(6, 'months');

const Details = React.createClass({
    propTypes: {
        details: React.PropTypes.object.isRequired
    },

    onSubmit(event) {
        event.preventDefault();

        if (this.props.details.validate()) {
            this.props.details.save();
            this.props.router.push('/questionnaire/questions/1');
        }
    },

    onChange(propertyName, newValue) {
        this.props.details.setState({[propertyName]: newValue});
    },

    datePickerMounted(elementRef) {
        if (elementRef) {
            const input = ReactDOM.findDOMNode(elementRef).querySelector('input');
            input.addEventListener('focus', event => {
                const clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('mousedown', true, true);
                input.dispatchEvent(clickEvent);
            });
        }
    },

    render() {
        const details = this.props.details;

        const inputTheme = {
            inputElement: Styles.inputElement
        };

        return (
            <form className={Styles.details} onSubmit={this.onSubmit}>
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Your child's name"
                    value={details.babyName}
                    error={details.errors.babyName}
                    maxLength={100}
                    onChange={this.onChange.bind(this, 'babyName')}
                />
                <DatePicker
                    ref={this.datePickerMounted}
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    minDate={minDate.toDate()}
                    maxDate={maxDate.toDate()}
                    label="Your child's date of birth"
                    value={details.babyDob && details.babyDob.toDate()}
                    error={details.errors.babyDob}
                    onChange={value => this.onChange('babyDob', moment(value))}
                />
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Your name"
                    value={details.parentName}
                    maxLength={100}
                    error={details.errors.parentName}
                    onChange={this.onChange.bind(this, 'parentName')}
                />
                <Input
                    type="email"
                    className={Styles.textBox}
                    theme={{...inputTheme, label: Styles.label}}
                    label="Your email address (so we can send you the results)"
                    value={details.parentEmail}
                    maxLength={100}
                    error={details.errors.parentEmail}
                    onChange={this.onChange.bind(this, 'parentEmail')}
                />
                <button className={Styles.nextButton} type="submit">
                    Next
                </button>
            </form>
        );
    }
});

export default withRouter(Details);
