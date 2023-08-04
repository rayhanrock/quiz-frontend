import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCards';
import { Grid, Pagination, Segment, Input } from 'semantic-ui-react';
import { handleError } from '../utiles/handleError';
import withLoading from '../hoc/WithLoading';

import TagDropdown from '../components/TagDropdown';
import CategoryDropdown from '../components/CategoryDropdown';

function Quizzes({ isLoading, startLoading, stopLoading }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchedText, setSearchedText] = useState('');

  const getData = React.useCallback(async () => {
    startLoading();
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes/`, {
        params: {
          page: currentPage,
          categories: selectedCategories.join(','),
          tags: selectedTags.join(','),
          title: searchedText,
        },
      })
      .then((response) => {
        setQuizzes(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
  }, [currentPage, selectedTags, selectedCategories, searchedText]);

  useEffect(() => {
    getData();
  }, [getData]);

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
        columns='equal'
        style={{ marginTop: '15px', marginBottom: '30px' }}>
        <Grid.Column width={4}>
          <h1>Quizzes</h1>
        </Grid.Column>
        <Grid.Column width={6}>
          <Input
            fluid
            icon={{ name: 'search' }}
            placeholder='Search quiz...'
            value={searchedText}
            onChange={(e) => setSearchedText(e.target.value)}
          />
        </Grid.Column>
        <Grid.Column
          width={6}
          textAlign='right'>
          <TagDropdown
            value={selectedTags}
            onChange={handleTagChange}
          />
          <CategoryDropdown
            value={selectedCategories}
            onChange={handleCategoryChange}
          />
        </Grid.Column>
      </Grid>
      {!isLoading &&
        (quizzes.length === 0 ? (
          <Segment textAlign='center'>Nothing found .</Segment>
        ) : (
          <>
            <QuizCard quizzes={quizzes} />
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
}

export default withLoading(Quizzes);
