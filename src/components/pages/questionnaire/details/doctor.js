import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {withRouter} from 'react-router';

import './react-datepicker-with-em.scss';
import Styles from './details.scss';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-datepicker/dist/react-datepicker'

const Details = React.createClass({
    propTypes: {
        details: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {};
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

    render() {
        const details = this.props.details;

        const inputTheme = {
            inputElement: Styles.inputElement
        };

        return (
            <form className={Styles.details} onSubmit={this.onSubmit} ref={form => this.form = form}>
                <Input
                    type="email"
                    className={Styles.textBox}
                    theme={{...inputTheme, label: Styles.label}}
                    label="Your doctor's email address (optional - so we can send them the results too)"
                    value={details.doctorEmail}
                    maxLength={100}
                    error={details.errors.doctorEmail}
                    onFocus={this.closeDatePicker}
                    onChange={this.onChange.bind(this, 'doctorEmail')}
                />
                <input type="submit" className={Styles.nextButton} value="Next" />
            </form>
        );
    }
});

export default withRouter(Details);
