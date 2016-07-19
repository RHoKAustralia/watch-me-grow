import React from 'react';

import Switcher from '../../common/switcher';
import ReactMarkdown from 'react-markdown';

import Styles from './stage-switcher.scss';

const StageSwitcher = React.createClass({
    propTypes: {
        stages: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            description: React.PropTypes.string
        })).isRequired
    },

    getInitialState() {
        return {
            stageIndex: 0
        }
    },

    onLeftClick() {
        this.setState({
            stageIndex: this.state.stageIndex - 1
        });
    },

    onRightClick() {
        this.setState({
            stageIndex: this.state.stageIndex + 1
        });
    },

    getCurrentStage() {
        return this.props.stages[this.state.stageIndex];
    },

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
});

export default StageSwitcher;
