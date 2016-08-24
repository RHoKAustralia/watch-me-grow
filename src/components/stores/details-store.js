import React from 'react';
import emailValidator from 'email-validator';
import moment from 'moment';

const REQUIRED_TEXT = ['babyName', 'parentName', 'parentEmail'];
const LOCAL_STORAGE_KEY = 'wmg-details';

const DetailsStore = ComposedComponent => React.createClass({
    getInitialState() {
        return {
            babyName: '',
            babyDob: '',
            parentName: '',
            parentEmail: '',
            errors: {}
        }
    },

    componentWillMount() {
        const fromStorageRaw = sessionStorage.getItem(LOCAL_STORAGE_KEY);
        if (fromStorageRaw) {
            const storedDetails = JSON.parse(fromStorageRaw);

            this.setState({
                babyName: storedDetails.babyName,
                babyDob: moment(storedDetails.babyDob),
                parentName: storedDetails.parentName,
                parentEmail: storedDetails.parentEmail
            });
        }
    },

    validate() {
        const errors = {};

        REQUIRED_TEXT.forEach(name => {
            if (!this.state[name] || !this.state[name].length) {
                errors[name] = 'Required';
            }
        });

        if (!errors.parentEmail && !emailValidator.validate(this.state.parentEmail)) {
            errors.parentEmail = 'This doesn\'t look like an email address - try checking it again?';
        }

        if (!this.state.babyDob) {
            errors.babyDob = 'Required';
        } else if (this.state.babyDob.isAfter(moment().subtract(6, 'months'))) {
            errors.babyDob = 'Watch Me Grow is intended for babies older than 6 months';
        }

        const validated = !Object.keys(errors).length;

        this.setState({
            errors,
            validated
        });

        return validated;
    },

    save() {
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            babyName: this.state.babyName,
            babyDob: this.state.babyDob.toString(),
            parentName: this.state.parentName,
            parentEmail: this.state.parentEmail
        }));
    },

    onDetailsChanged(newDetails) {
        this.setState(Object.assign({validated: false}, newDetails));
    },

    clear() {
        sessionStorage.removeItem(LOCAL_STORAGE_KEY);
        this.setState(this.getInitialState());
    },


    render() {
        const details = Object.assign({}, this.state, {
            setState: this.onDetailsChanged,
            save: this.save,
            validate: this.validate,
            clear: this.clear
        });

        return <ComposedComponent {...this.props} details={details}/>;
    }
});

export default DetailsStore;