import React from 'react';
import { Card, Rating, Comment } from 'semantic-ui-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';

const Feedbacks = ({ quizzID }) => {
  const [feedbacks, setFeedbacks] = React.useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/quizzes/${quizzID}/feedback/`,
        {
          params: { page: currentPage, feedbacks: 3 },
        }
      )
      .then((response) => {
        setFeedbacks(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 3));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [quizzID, currentPage]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  return (
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
    </>
  );
};

export default Feedbacks;
