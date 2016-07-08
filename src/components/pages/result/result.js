import React from 'react';
import classNames from 'classnames';

import flag from './flag.svg';
import stethoscope from './stethoscope.svg';

import Styles from './result.scss';

const Result = React.createClass({
    componentWillMount() {
        this.props.results.mark();
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
                                Your answers indicate that your child could benefit from a more detailed
                                assessment by a GP or another health professional.
                            </h5>
                        </When>
                        <Otherwise>
                            <h5 className={Styles.outcomeTitle}>
                                Your child is developing as expected for their age.
                            </h5>
                            <h6 className={Styles.outcomeSubtitle}>
                                Based on your answers you have no concerns about how your child is developing.
                            </h6>
                        </Otherwise>
                    </Choose>
                </div>
                <div className={Styles.disclaimer}>
                    All children grow and develop at their own pace. Please see below for information on what is
                    expected for your child's age.
                </div>
            </article>
        );
    }
});

export default Result;
