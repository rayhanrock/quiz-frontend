import React from 'react';
import withLoading from '../hoc/WithLoading';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { handleError } from '../utiles/handleError';
import TagDropdown from '../components/TagDropdown';
import CategoryDropdown from '../components/CategoryDropdown';

import { Grid, Pagination, Segment, Table, Header } from 'semantic-ui-react';

const Leaderboard = ({ isLoading, startLoading, stopLoading }) => {
  const [leaderboard, setLeaderboard] = useState({});
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    startLoading();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page: currentPage,
        categories: selectedCategories.join(','),
        tags: selectedTags.join(','),
        participants: 10,
      },
    };

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/leaderboard/`, config)
      .then((response) => {
        setLeaderboard(response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
  }, [currentPage, selectedTags, selectedCategories]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };
  const handleTagChange = (value) => {
    setSelectedTags(value);
  };

  return (
    <>
      <Grid
        stackable
        style={{ marginTop: '1rem' }}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h2'>Leaderboard</Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <TagDropdown
              value={selectedTags}
              onChange={handleTagChange}
            />
            <CategoryDropdown
              value={selectedCategories}
              onChange={handleCategoryChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {!isLoading &&
        (leaderboard.count === 0 ? (
          <Segment textAlign='center'>Nothing found .</Segment>
        ) : (
          <>
            <Table
              celled
              striped
              stackable
              selectable
              color='grey'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Quiz</Table.HeaderCell>
                  <Table.HeaderCell>Participant name</Table.HeaderCell>
                  <Table.HeaderCell>Score</Table.HeaderCell>
                  <Table.HeaderCell>Attempt date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {leaderboard.results?.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <NavLink
                        state={{ color: 'black' }}
                        to={`/quizzes/${item.quiz_id}`}>
                        {item.quiz}
                      </NavLink>
                    </Table.Cell>
                    <Table.Cell>{item.user}</Table.Cell>
                    <Table.Cell>{item.score}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.start_time).toLocaleDateString()}
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
        ))}
    </>
  );
};

export default withLoading(Leaderboard);
