import PropTypes from 'prop-types';
import React from 'react';

import Switcher from '../../common/switcher';
import ReactMarkdown from 'react-markdown';

import Styles from './stage-switcher.module.scss';

class StageSwitcher extends React.Component {
    static propTypes = {
        stages: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string
        })).isRequired
    };

    state = {
        stageIndex: this.props.initialStage || 0
    };

    onLeftClick = () => {
        this.setState({
            stageIndex: this.state.stageIndex - 1
        });
    };

    onRightClick = () => {
        this.setState({
            stageIndex: this.state.stageIndex + 1
        });
    };

    getCurrentStage = () => {
        return this.props.stages[this.state.stageIndex];
    };

    render() {
        return (
            <div className={Styles.root}>
                <Switcher
                    onLeftClick={this.onLeftClick}
                    onRightClick={this.onRightClick}
                    leftDisabled={this.state.stageIndex <= 0}
                    rightDisabled={this.state.stageIndex >= this.props.stages.length - 1}
                    text={this.getCurrentStage().name}
                />
                <ReactMarkdown className={Styles.markdown} source={this.getCurrentStage().description} />
            </div>
        );
    }
}

export default StageSwitcher;
