import React, { useState } from "react";
import Mood from "./Mood.js";
import Question from "./Question.js";
import useVisualMode from "../../hooks/useVisualMode";
import Followup from "./Followup.js";
import Completion from "./Completion.js";
import Start from "./Start.js";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    width: "25%"
  }
}));

const MOOD = "MOOD";
const QUESTION = "QUESTION";
const FOLLOWUP = "FOLLOWUP";
const COMPLETION = "COMPLETION";
const START = "START";

export default function Workthrough() {
  const classes = useStyles();

  const [state, setState] = useState({
    questions: [],
    currentQuestion: {},
    responsesChosen: [],
    currentFollowup: {},
    currentThinkingTrap: {}
  });

  const { mode, transition, back } = useVisualMode(START);

  const startNextQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestion: {}
    }));
    transition(QUESTION);
  };

  const unansweredQuestions = state.questions.filter(
    question => !question.answered
  );
  // sets a current questions if there's no current question and there's still unanswered questions
  if (!state.currentQuestion.id && unansweredQuestions.length) {
    const currentQuestion = unansweredQuestions.pop();
    setState(prev => ({
      ...prev,
      currentQuestion
    }));
    // transitions to mood when there's no unanswered questions left
    // this function is why the back button on mood doesn't work...to be fixed depending on how we want to allow users to go back
  } else if (!unansweredQuestions.length && mode === QUESTION) {
    transition(MOOD);
  }

  // starts the workthrough when the user selects 4 or 6 questions. needs to be updated to pull real data
  const startWorkthrough = numberOfQuestions => {
    axios
      .request({
        url: "http://localhost:3001/reflections",
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true
        },
        params: {
          number: numberOfQuestions
        },
        withCredentials: true
      })
      .then(function(response) {
        for (let question of response.data) {
          question.answered = false;
        }
        setState(prev => ({ ...prev, questions: response.data }));
        startNextQuestion();
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  // this function is triggered when a user responds to a question
  // sets the current question answered to true, saves their response in the responseChosen array in state, and pulls the followup
  const respond = responseID => {
    const followup = state.currentQuestion.responses.find(
      response => response.id === responseID
    ).follow_ups;

    const thinkingTrap = state.currentQuestion.responses.find(
      response => response.id === responseID
    ).thinking_trap;

    setState(prev => ({
      ...prev,
      questions: [
        ...state.questions.filter(({ id }) => id !== state.currentQuestion.id),
        { ...state.currentQuestion, answered: true }
      ],
      responsesChosen: [...prev.responsesChosen, responseID],
      currentFollowup: followup,
      currentThinkingTrap: thinkingTrap
    }));
    transition(FOLLOWUP);
  };

  // triggered when a user responds to the mood question. currently doesn't save their response anywhere
  const respondMood = (moodValue) => {
    // axios.request({
    //   url: 'http://localhost:3001/reflections',
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Credentials': true
    //   },
    //   data: {
    //     {PUT STUFF HERE TO SEND}
    //   },
    //   withCredentials: true
    // }).then(function (response) {
    //   transition(COMPLETION)
    // })
    //   .catch(function (error) {
    //     console.log(error);
    //   })
    transition(COMPLETION)
  }

  // progress is based on number of questions answered so doesn't go down if the user presses the back button
  const currentProgress = state.questions.filter(question => {
    return question.answered === false;
  }).length;

  return (
    <main className="workthrough">
      <h2>Workthrough</h2>
      <section>
        {mode === START && <Start startWorkthrough={startWorkthrough} />}
        {mode === MOOD && <Mood onResponse={respondMood} />}
        {mode === QUESTION && (
          <Question
            question={state.currentQuestion}
            responses={state.currentQuestion.responses}
            onResponse={respond}
          />
        )}
        {mode === FOLLOWUP && (
          <Followup
            followup={state.currentFollowup}
            thinkingTrap={state.currentThinkingTrap}
          />
        )}
        {mode === COMPLETION && <Completion />}
      </section>
      <section>
        <label htmlFor="workthrough-progress">
          Progress {state.questions.length - currentProgress}/
          {state.questions.length}
        </label>
        <div className={classes.root}></div>
        <IconButton onClick={() => back()}>
          <ExpandLessIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={() => startNextQuestion()}>
          <ExpandMoreIcon fontSize="large" />
        </IconButton>
      </section>
    </main>
  );
}
