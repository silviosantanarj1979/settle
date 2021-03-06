import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
// import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
// import { makeStyles } from "@material-ui/core/styles";

//styling
// const useStyles = makeStyles(theme => ({
//   root: {
//     display: 'flex',
//     '& > * + *': {
//       marginLeft: theme.spacing(2),
//     },
//   },
// }));
const CenterDiv = styled.div`
  width: 100vw;
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BackButton = styled(Button)`
  height: 50px;
  width: 50px;
`;
const BackImg = styled.img`
  height: 50px;
  width: 50px;
`;
const StyledCalendar = styled(Calendar)`
  width: 450px;
  height: 300px;
  font-size: 1rem !important;
  .react-calendar__navigation: {
    // this doesn't work why!
    font-size: 1rem !important;
  }
`;
const Title = styled.h1`
  text-align: center;
  margin-left: 31%
`;
const StyledDiv = styled.div`
  display: flex;
  margin-top: 3%;
  margin-bottom: 3%;
`;
const StyledDiv2 = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledTitle = styled.h1`
  color: #ffd882;
`;
// const NotePaper = styled(Paper)`
//   padding: 3%;
//   background-color: #353c52;
// `;

export default function MoodCalendar(props) {
  const [state, setState] = useState({
    moods: [],
    loading: true
  });

  const emojiLookup = {
    1: "😢",
    2: "😟",
    3: "😐",
    4: "😃",
    5: "😄"
  };

  useEffect(() => {
    axios
      .request({
        url: "/mood-calendar",
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true
        },
        params: {
          user_id: props.user.id
        },
        withCredentials: true
      })
      .then(response => {
        setState(prev => ({ ...prev, moods: response.data, loading: false })); // if no moods, then state.moods is just an empty array
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [props.user.id]);

  let tileContent = "";
  if (state.moods.length > 0) {
    tileContent = ({ date }) => {
      let content = "";
      state.moods.forEach(mood => {
        let calendarDate = date.toDateString();
        let moodDate = new Date(mood.created_at); // changes it to a date object
        let compareMoodDate = moodDate.toDateString(); // changes it to a date string so it can be compared
        if (calendarDate === compareMoodDate) {
          content = emojiLookup[mood.value];
        }
      });
      return content;
    };
  }

  return (
    <main>
      <StyledDiv>
        <BackButton onClick={() => {props.goToProgressPage("HOME")}}>
          <BackImg src="https://res.cloudinary.com/dpfixnpii/image/upload/v1582400198/arrow_xph8bj.svg" />
        </BackButton>
      <Title>My Mood Calendar</Title>
      </StyledDiv>
      {state.loading ? <CenterDiv><CircularProgress /></CenterDiv> : 
      <StyledDiv2>
        {state.moods.length > 0 ? (
          <StyledCalendar tileContent={tileContent} calendarType={"US"} />
        ) : (
          <StyledTitle>
            {" "}
            Start a reflection to start tracking your moods!
          </StyledTitle>
        )}
        </StyledDiv2> }
    </main>
  );
}
