import withLoading from '../hoc/WithLoading';
import { Table, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { handleError } from '../utiles/handleError';
import { Grid, Pagination, Header, Message, Segment } from 'semantic-ui-react';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

const UserStatistics = ({ isLoading, startLoading, stopLoading }) => {
  const auth = useSelector((state) => state.auth);
  const [userStats, setUserStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getData = useCallback(async () => {
    startLoading();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
      params: {
        page: currentPage,
        quizs: 10,
      },
    };

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/user-attempts-statistics/`,
        config
      )
      .then((response) => {
        console.log(response.data);
        setUserStats(response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
        stopLoading();
      })
      .catch((error) => {
        console.log(error);
        handleError(error);
        stopLoading();
      });
  }, [currentPage]);

  useEffect(() => {
    console.log(auth.token);
    getData();
  }, [getData]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  return (
    !isLoading &&
    (userStats.count === 0 ? (
      <Segment textAlign='center'>You have not attempted any quiz yet.</Segment>
    ) : (
      <>
        <Message
          success
          header='Basic Statistics: '
          attached='top'
        />
        <Segment
          stacked
          attached
          style={{ marginBottom: '20px' }}>
          <Grid
            columns={2}
            divided
            stackable>
            <Grid.Row>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Total attempts:
                </Header>
                <span style={{ paddingLeft: '10px' }}>{userStats.count}</span>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Passed attempts:
                </Header>
                <span style={{ paddingLeft: '10px', display: 'inline-block' }}>
                  {userStats.results.total_passed}
                </span>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Pass rate :
                </Header>
                <span style={{ paddingLeft: '10px' }}>
                  {userStats.results.pass_rate + '%'}
                </span>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Failed attempts:
                </Header>
                <span style={{ paddingLeft: '10px' }}>
                  {userStats.results.total_failed}
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Quiz Title</Table.HeaderCell>
              <Table.HeaderCell>Total Marks</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Pass</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {userStats.results.data.map((userStat, index) => (
              <Table.Row
                key={index}
                positive={userStat.has_passed}
                negative={!userStat.has_passed}>
                <Table.Cell>
                  <NavLink
                    state={{ color: 'black' }}
                    to={`/quizzes/${userStat.quiz_id}`}>
                    {userStat.quiz_title}
                  </NavLink>
                </Table.Cell>
                <Table.Cell>{userStat.quiz_total_marks}</Table.Cell>
                <Table.Cell>{userStat.score}</Table.Cell>
                <Table.Cell>
                  {new Date(userStat.date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  {userStat.has_passed ? (
                    <Icon
                      color='green'
                      name='checkmark'
                      size='large'
                    />
                  ) : (
                    <Icon
                      color='red'
                      name='close'
                      size='large'
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
    ))
  );
};

export default withLoading(UserStatistics);
