import React from 'react';
import classNames from 'classnames';

import flag from './flag.svg';
import stethoscope from './stethoscope.svg';
import StageSwitcher from './stage-switcher';
import stages from './stages/stages';
import strings from 'data/strings';

import sendResults from 'send-results';

import Styles from './result.scss';

const Result = React.createClass({
    componentWillMount() {
        // this.props.details.validate();
        this.props.results.mark();

        sendResults(this.props.details, this.props.results);
    },

    render() {
        const concern = this.props.results.concern;

        return (
            <article className={Styles.root}>
                <svg dangerouslySetInnerHTML={{__html: concern ? stethoscope : flag}}
                     className={classNames(
                        Styles.icon,
                        {[Styles.iconConcern]: concern},
                        {[Styles.iconNoConcern]: !concern}
                      )}
                />
                <div className={Styles.outcome}>
                    <Choose>
                        <When condition={concern}>
                            <h5 className={Styles.outcomeTitle}>
                                {strings.result.concerns.title}
                            </h5>
                        </When>
                        <Otherwise>
                            <h5 className={Styles.outcomeTitle}>
                                {strings.result.noConcerns.title}
                            </h5>
                            <h6 className={Styles.outcomeSubtitle}>
                                {strings.result.noConcerns.subtitle}
                            </h6>
                        </Otherwise>
                    </Choose>
                </div>
                <div className={Styles.disclaimer}>
                    All children grow and develop at their own pace. Please see below for information on what is
                    expected for your child's age.
                </div>
                <StageSwitcher stages={stages}/>
            </article>
        );
    }
});

export default Result;
