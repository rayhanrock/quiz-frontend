import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Message } from 'semantic-ui-react';
import { useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Pagination,
  Label,
  Segment,
  Confirm,
  Divider,
  Statistic,
} from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { handleError } from '../utiles/handleError';
import withLoading from '../hoc/WithLoading';

const QuizAttempt = ({ isLoading, startLoading, stopLoading }) => {
  const auth = useSelector((state) => state.auth);

  const { quizID } = useParams();
  const location = useLocation();
  const timeLimit = location.state?.timeLimit;
  const navigate = useNavigate();

  if (!timeLimit) {
    navigate('/quizzes/');
  }

  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(timeLimit * 60);
  const [timeTaken, setTimeTaken] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!submitted) {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      if (secondsLeft === 1 && !submitted) {
        handleSubmitQuiz();
      }
    };
  }, [secondsLeft, submitted]);

  useEffect(() => {
    setTimeTaken(timeLimit * 60 - secondsLeft);
  }, [secondsLeft, timeLimit]);

  const getData = React.useCallback(async () => {
    startLoading();
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/quizzes/${quizID}/questions/`,
        {
          params: { page: currentPage, qs: 10 },
        }
      )
      .then((response) => {
        setQuestions(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
  }, [currentPage]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleAnswerChange = (questionId, selectedAnswerId) => {
    setAnswers((prevAnswers) => {
      const questionIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === questionId
      );

      if (questionIndex !== -1) {
        prevAnswers[questionIndex].selected_answer = selectedAnswerId;
        return [...prevAnswers];
      } else {
        return [
          ...prevAnswers,
          {
            question_id: questionId,
            selected_answer: selectedAnswerId,
          },
        ];
      }
    });
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    clearInterval(intervalRef.current);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/submit/`,
        {
          quiz_id: quizID,
          answers: answers,
        },
        config
      )
      .then((response) => {
        setScore(response.data.data.score);
        toast.success(response.data.message);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const getAnswerLabelColor = (questionID, answer) => {
    if (!submitted) return 'black';
    const questionIndex = answers.findIndex(
      (answer) => answer.question_id === questionID
    );
    if (questionIndex !== -1) {
      const selectedAnswer = answers[questionIndex].selected_answer;

      if (selectedAnswer === answer.id) {
        if (answer.is_correct) {
          return 'green';
        } else {
          return 'red';
        }
      } else {
        if (answer.is_correct) {
          return 'green';
        } else {
          return 'black';
        }
      }
    }

    return 'black';
  };

  const showConfirmSubmit = () => {
    setConfirmSubmit(true);
  };
  const handleConfirm = () => {
    setConfirmSubmit(false);
    handleSubmitQuiz();
  };
  const handleCancel = () => {
    setConfirmSubmit(false);
  };

  return (
    !isLoading && (
      <div>
        {submitted ? (
          <>
            <Message
              style={{ marginTop: '25px' }}
              success
              header='Result Summary : '
              attached='top'
            />
            <Segment
              stacked
              attached
              raised>
              <Grid
                textAlign='center'
                columns={2}
                relaxed='very'>
                <Grid.Column>
                  <Statistic>
                    <Statistic.Value>{timeTaken}</Statistic.Value>
                    <Statistic.Label>Duration (seconds)</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    <Statistic>
                      <Statistic.Value>{score}</Statistic.Value>
                      <Statistic.Label>Total points</Statistic.Label>
                    </Statistic>
                  </p>
                </Grid.Column>
              </Grid>

              <Divider vertical>AND</Divider>
            </Segment>
          </>
        ) : (
          <h2 style={{ marginTop: '20px', marginBottom: '15px' }}>
            Time Left: {Math.floor(secondsLeft / 60)}:{secondsLeft % 60} seconds
          </h2>
        )}

        {questions.map((question) => (
          <Card
            key={question.id}
            fluid>
            <Card.Content>
              <Label
                style={{ float: 'right' }}
                circular
                color='green'
                key={question.id}>
                Points : {question.points}
              </Label>
              <Card.Header>{question.text}</Card.Header>

              <Card.Description>
                {question.answers.map((answer) => (
                  <div key={answer.id}>
                    <div className='ui checkbox'>
                      <input
                        disabled={submitted}
                        id={`answer_${answer.id}`}
                        type='checkbox'
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={answers.some(
                          (a) =>
                            a.question_id === question.id &&
                            a.selected_answer === answer.id
                        )}
                        onChange={() =>
                          handleAnswerChange(question.id, answer.id)
                        }
                      />
                      <label
                        htmlFor={`answer_${answer.id}`}
                        style={{
                          color: getAnswerLabelColor(question.id, answer),
                          cursor: 'pointer',
                          opacity: 1,
                        }}>
                        {answer.text}
                      </label>
                    </div>
                  </div>
                ))}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}

        <Grid
          centered
          style={{ marginTop: '10px', marginBottom: '15px' }}>
          <Grid.Row>
            {totalPages > 0 && (
              <Pagination
                activePage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                ellipsisItem={null}
                boundaryRange={1}
                siblingRange={1}
              />
            )}
          </Grid.Row>
        </Grid>
        {!submitted && (
          <Button
            onClick={showConfirmSubmit}
            fluid
            secondary>
            Submit
          </Button>
        )}
        <Confirm
          className='secondary'
          open={confirmSubmit}
          cancelButton='Never mind'
          confirmButton="Let's do it"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    )
  );
};

export default withLoading(QuizAttempt);
