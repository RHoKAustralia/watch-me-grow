import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {withRouter} from 'react-router';

import './react-datepicker-with-em.scss';
import Styles from './details.scss';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-datepicker/dist/react-datepicker'

const minDate = moment().subtract(4, 'years');
const maxDate = moment().subtract(6, 'months');

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
            this.props.router.push('/questionnaire/doctor');
        }
    },

    onChange(propertyName, newValue) {
        this.props.details.setState({[propertyName]: newValue});
    },

    onDateClick() {
        this.setState({
            showDatePicker: true
        });
    },

    onDateChange(value) {
        this.closeDatePicker();
        this.onChange('babyDob', value)
    },

    closeDatePicker() {
        this.setState({
            showDatePicker: false
        });
    },

    render() {
        const details = this.props.details;

        const inputTheme = {
            inputElement: Styles.inputElement
        };

        return (
            <form className={Styles.details} onSubmit={this.onSubmit} ref={form => this.form = form}>
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Child's First Name"
                    value={details.babyFirstName}
                    error={details.errors.babyFirstName}
                    maxLength={100}
                    onFocus={this.closeDatePicker}
                    onChange={this.onChange.bind(this, 'babyFirstName')}
                />
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Child's Last Name"
                    value={details.babyLastName}
                    error={details.errors.babyLastName}
                    maxLength={100}
                    onFocus={this.closeDatePicker}
                    onChange={this.onChange.bind(this, 'babyLastName')}
                />
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Gender"
                    value={details.babyGender}
                    error={details.errors.babyGender}
                    maxLength={100}
                    onFocus={this.closeDatePicker}
                    onChange={this.onChange.bind(this, 'babyGender')}
                />
                <Input
                    readOnly="true"
										onFocus={this.onDateClick}
                    ref={input => this.input = input}
                    label="Your child's date of birth"
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    value={details.babyDob ? details.babyDob.format('DD/MM/YYYY') : ''}
                    error={details.errors.babyDob}/>
                <If condition={this.state.showDatePicker}>
                    <DatePicker
                        inline
                        showYearDropdown
                        className={Styles.datePicker}
                        minDate={minDate}
                        maxDate={maxDate}
                        selected={details.babyDob}
                        onChange={this.onDateChange}
                    />
                </If>
                <Input
                    type="text"
                    className={Styles.textBox}
                    theme={inputTheme}
                    label="Your name"
                    value={details.parentName}
                    maxLength={100}
                    error={details.errors.parentName}
                    onFocus={this.closeDatePicker}
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
                    onFocus={this.closeDatePicker}
                    onChange={this.onChange.bind(this, 'parentEmail')}
                />
                <input type="submit" className={Styles.nextButton} value="Next" />
            </form>
        );
    }
});

class DatePickerInput extends React.Component {
    render() {
        const inputTheme = {
            inputElement: Styles.inputElement
        };

        return (
            <Input
                {... this.props}
                readOnly="true"
                ref={input => this.input = input}
                label="Your child's date of birth"
                type="text"
                className={Styles.textBox}
                theme={inputTheme}
            />
        );
    }
}

export default withRouter(Details);
