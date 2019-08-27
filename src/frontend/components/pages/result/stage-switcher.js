
import React from "react";

import Switcher from "../../common/switcher";
import ReactMarkdown from "react-markdown";

import Styles from "./stage-switcher.module.scss";

class StageSwitcher extends React.Component {
  static propTypes = {
    stages: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
      })
    ).isRequired
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

  componentDidMount() {
    this.loadCurrentStage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stageIndex !== prevState.stageIndex) {
      this.loadCurrentStage();
    }
  }

  async loadCurrentStage() {
    this.setState({
      currentStage: null,
      currentStageError: null
    });

    try {
      const res = await fetch(
        this.props.stages[this.state.stageIndex].description
      );

      if (res.status === 200) {
        const text = await res.text();
        this.setState({
          currentStage: text
        });
      } else {
        throw new Error(
          "Failed to get current stage: response was " + res.status
        );
      }
    } catch (e) {
      console.error(e);
      this.setState({
        currentStageError: e
      });
    }
  }

  getCurrentStage() {
    if (this.state.currentStage) {
      const stageMetadata = this.props.stages[this.state.stageIndex];
      return {
        name: stageMetadata.name,
        description: this.state.currentStage
      };
    } else if (this.state.currentStageError) {
      return {
        name: "Error",
        description: "Could not return current stage"
      };
    } else {
      return { name: "Loading...", description: "" };
    }
  }

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
        <ReactMarkdown
          className={Styles.markdown}
          source={this.getCurrentStage().description}
        />
      </div>
    );
  }
}

export default StageSwitcher;
