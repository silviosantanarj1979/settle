import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import QuestionList from "./QuestionList";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import useSignUpQuiz from "../../hooks/useSignUpQuiz";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
const axios = require("axios").default;

const PaperQuiz = styled(Paper)`
  margin-top: 1em;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 1em;
  background-color: #353c52;
  background-image: url(http://www.transparenttextures.com/patterns/cubes.png);
`;

const CardQuiz = styled(Card)`
  margin-top: 2em;
  margin-left: 5%;
  margin-right: 5%;

  align-items: center;
  height: 100%;
  background-color: #353c52;
`;

const CardQuizList = styled(Card)`
  padding: 2em;
  margin-top: 2em;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 2em;
  align-items: center;
  height: 100%;
  background-color: #353c52;
`;

const CardContentQuiz = styled(CardContent)`
  padding: 10px;
  padding-bottom: 0 !important;
  margin-top: 5%;
  margin-bottom: 5%;
  color: white;
  text-align: center;
`;

const TypographyHeader = styled(Typography)`
  font-size: large;
  font-weight: 600;
`;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  responseList: {
    justifyContent: "center",
    textAlign: "center",
    margin: theme.spacing(2)
  },
  cards: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#353c52",
    color: "white"
  }
  // formControl: {
  //   margin: theme.spacing(3)
  // }
}));
export default function SignUpQuiz(props) {
  const classes = useStyles();
  const history = useHistory();

  const assignUserInterest = () => {
    const userId = props.user.id;
    const interests = Object.entries(questionState);

    let axiosArr = [];
    for (let interest of interests) {
      const postData = {
        interest_id: interest[0],
        value: interest[1],
        user_id: userId
      };
      const newPromise = axios({
        method: "post",
        url: "/user_interests",
        data: postData
      });
      axiosArr.push(newPromise);
    }

    console.log(axiosArr);

    return axios
      .all(axiosArr)
      .then(
        axios.spread((...responses) => {
          responses.forEach(res => console.log("Success"));
          console.log("submitted all axios calls");
          localStorage.removeItem("mode");
          history.push("/menu");
        })
      )

      .catch(error => {
        console.log(error);
      });
  };

  const { handleSubmit, changeQuestion, questionState } = useSignUpQuiz(
    assignUserInterest
  );

  return (
    <main>
      <PaperQuiz className={classes.root}>
        <CardQuiz>
          <CardContentQuiz>
            <TypographyHeader>
              Thanks for signing up {props.user.name}, we'd like to ask you a
              few questions to get to know you better. It'll help us loads!
            </TypographyHeader>
          </CardContentQuiz>
        </CardQuiz>
        <CardQuizList className={classes.responseList}>
          <form onSubmit={handleSubmit}>
            <QuestionList
              signupQuestions={props.signupQuestions}
              questionState={questionState}
              changeQuestion={changeQuestion}
            />

            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </CardQuizList>
      </PaperQuiz>
    </main>
  );
}
