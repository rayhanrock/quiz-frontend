import React from 'react';
import { Card, Grid, Button, Label, Icon } from 'semantic-ui-react';
import Feedbacks from '../components/Feedback';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import withLoading from '../hoc/WithLoading';

const QuizDetail = ({ isLoading, startLoading, stopLoading }) => {
  const auth = useSelector((state) => state.auth);

  const { quizID } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = React.useState([]);

  const getData = React.useCallback(async () => {
    startLoading();
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes/${quizID}/`)
      .then((response) => {
        setQuiz(response.data);
        stopLoading();
      })
      .catch((error) => {
        stopLoading();
        toast.error(error.response.data.detail);

        navigate(`/quizzes/`);
      });
  });

  useEffect(() => {
    getData();
  }, []);

  const handleStartQuiz = () => {
    const timeLimit = quiz.time_limit;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/start/`,
        {
          quiz_id: quizID,
        },
        config
      )
      .then((response) => {
        console.log(response);
        toast.success(response.data.message);
        navigate(`/quizzes/${quiz.id}/attempt/`, {
          state: { timeLimit: timeLimit },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    !isLoading && (
      <div>
        <Grid
          style={{ marginTop: '15px', marginBottom: '10px' }}
          columns={2}
          stackable>
          <Grid.Column width={11}>
            <Card fluid>
              <Card.Content>
                <h1>{quiz.title}</h1>
                <Card.Description>{quiz.description}</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={5}>
            <Card fluid>
              <Card.Content>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <p>
                        Time Limit:{' '}
                        <Label>
                          <Icon name='clock' /> {quiz.time_limit} minutes
                        </Label>
                      </p>
                      <p>
                        Passing Marks:{' '}
                        <Label
                          circular
                          as='a'>
                          {quiz.passing_marks_percentage}%
                        </Label>{' '}
                      </p>
                      <p>
                        Tags:{' '}
                        {quiz.tags?.map((tag, index) => (
                          <Label
                            key={index}
                            as='a'>
                            {tag}
                          </Label>
                        ))}
                      </p>
                      <p>
                        Categories:{' '}
                        {quiz.categories?.map((categories, index) => (
                          <Label
                            key={index}
                            as='a'>
                            {categories}
                          </Label>
                        ))}
                      </p>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column textAlign='center'>
                      <Button
                        onClick={handleStartQuiz}
                        fluid
                        secondary>
                        Start Quiz
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        {quiz?.id && <Feedbacks quizzID={quiz.id} />}
      </div>
    )
  );
};

export default withLoading(QuizDetail);
