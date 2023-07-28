import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCards';
import { Grid, Pagination } from 'semantic-ui-react';
import { handleError } from '../utiles/handleError';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getData = React.useCallback(async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes/`, {
        params: { page: currentPage },
      })
      .then((response) => {
        setQuizzes(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        handleError(error);
      });
  }, [currentPage]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  return (
    <div>
      <h1 style={{ marginTop: '15px', marginBottom: '30px' }}>Quizzes</h1>
      <QuizCard quizzes={quizzes} />
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
    </div>
  );
}

export default Quizzes;