import React from 'react';
import { Card, Rating, Comment, Header, Message } from 'semantic-ui-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  Grid,
  Pagination,
  Form,
  Segment,
  TextArea,
  Button,
} from 'semantic-ui-react';
import withLoading from '../hoc/WithLoading';
import { handleError } from '../utiles/handleError';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Feedbacks = ({ quizzID, startLoading, stopLoading, isLoading }) => {
  const auth = useSelector((state) => state.auth);
  const [feedbacks, setFeedbacks] = React.useState([]);

  const [rating, setReting] = React.useState(0);

  const [feedbackText, setFeedbackText] = React.useState('');
  const [feedbackSumitted, setFeedbackSumitted] = React.useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    startLoading();

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/quizzes/${quizzID}/feedback/`,
        {
          params: { page: currentPage, feedbacks: 9 },
        }
      )
      .then((response) => {
        setFeedbacks(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 9));
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
    setFeedbackSumitted(false);
  }, [quizzID, currentPage, feedbackSumitted]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleRate = (e, { rating, maxRating }) => {
    setReting(rating);
  };

  const handleFeedbackSubmit = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/${quizzID}/feedback/`,
        {
          rating: rating,
          comment: feedbackText,
        },
        config
      )
      .then((response) => {
        toast.success('Feedback added successfully');
        setFeedbackSumitted(true);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  return (
    !isLoading && (
      <>
        <h2>Feedbacks</h2>
        <Card.Group
          stackable
          itemsPerRow={3}>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <Card key={index}>
                <Card.Content>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <Comment.Group>
                          <Comment>
                            <Comment.Content>
                              <Comment.Author>
                                {feedback.participant}
                              </Comment.Author>
                              <Comment.Text>{feedback.comment}</Comment.Text>
                            </Comment.Content>
                          </Comment>
                        </Comment.Group>
                      </Grid.Column>
                      <Grid.Column
                        width={8}
                        textAlign='right'>
                        <Rating
                          icon='star'
                          defaultRating={feedback.rating}
                          maxRating={5}
                          disabled
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={{ width: '100%' }}>
              <Card.Content
                textAlign='center'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <p>No feedback available</p>
              </Card.Content>
            </Card>
          )}
        </Card.Group>
        <Grid
          centered
          style={{ marginTop: '10px', marginBottom: '15px' }}>
          <Grid.Row>
            {totalPages > 1 && (
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
        <Message
          style={{ marginTop: '25px' }}
          header='Add feedback : '
          attached='top'
        />
        <Segment attached>
          <Form>
            <Header size='small'>
              Rating :{' '}
              <Rating
                icon='star'
                defaultRating={0}
                maxRating={5}
                onRate={handleRate}
              />
            </Header>

            <Header size='small'>Feedback :</Header>
            <TextArea
              placeholder='Tell us more about you...'
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <Button
              secondary
              style={{ marginTop: '1rem' }}
              onClick={handleFeedbackSubmit}>
              Submit
            </Button>
          </Form>
        </Segment>
      </>
    )
  );
};

export default withLoading(Feedbacks);
