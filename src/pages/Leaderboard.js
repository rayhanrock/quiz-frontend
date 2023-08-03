import React from 'react';
import withLoading from '../hoc/WithLoading';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { handleError } from '../utiles/handleError';
import {
  Grid,
  Pagination,
  Segment,
  Table,
  Dropdown,
  Header,
} from 'semantic-ui-react';
import { useCallback } from 'react';

const Leaderboard = ({ isLoading, startLoading, stopLoading }) => {
  const [leaderboard, setLeaderboard] = useState({});
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
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
        console.log(response.data);
        setLeaderboard(response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
  }, [currentPage, selectedTags, selectedCategories]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes/categories/`, config)
      .then((response) => {
        const receivedResponse = response.data;
        const formattedCategories = receivedResponse.map((category) => ({
          text: category.name,
          value: category.name,
        }));
        setCategories(formattedCategories);
      })
      .catch((error) => {
        handleError(error);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes/tags/`, config)
      .then((response) => {
        const receivedResponse = response.data;
        const formattedTags = receivedResponse.map((tag) => ({
          text: tag.name,
          value: tag.name,
        }));
        setTags(formattedTags);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleCategoryChange = (e, { value }) => {
    setSelectedCategories(value);
  };
  const handleTagChange = (e, { value }) => {
    setSelectedTags(value);
  };

  return (
    !isLoading && (
      <>
        <Grid
          stackable
          style={{ marginTop: '1rem' }}>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as='h2'>Leaderboard</Header>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Dropdown
                labeled
                icon='tags'
                style={{ backgroundColor: 'white' }}
                className='icon'
                button
                floating
                options={tags}
                multiple
                selection
                search
                text='Tags'
                onChange={handleTagChange}
                value={selectedTags}
              />
              <Dropdown
                labeled
                icon='th'
                style={{ backgroundColor: 'white' }}
                className='icon'
                button
                floating
                options={categories}
                multiple
                selection
                search
                text='Category'
                onChange={handleCategoryChange}
                value={selectedCategories}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {leaderboard.count === 0 ? (
          <Segment textAlign='center'>None attempted any quiz yet.</Segment>
        ) : (
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
        )}

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
    )
  );
};

export default withLoading(Leaderboard);
