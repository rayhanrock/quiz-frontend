import React from 'react';
import { Route } from 'react-router-dom';
import Quizzes from '../pages/Quizzes';
import Dashboard from '../pages/Dashboard';
import { Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { Loader } from 'semantic-ui-react';
import { RequireAuth, StuffRoute } from './PrivateRoute';
import QuizDetail from '../pages/QuizDetails';
import QuizAttempt from '../pages/QuizAttempt';

const loading = () => (
  <Loader
    active
    inline='centered'
  />
);

const AppContent = () => {
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route
          path='/dashboard/'
          exact
          element={
            <StuffRoute>
              <Dashboard />
            </StuffRoute>
          }
        />
        <Route
          path='/quizzes/'
          exact
          element={
            <RequireAuth>
              <Quizzes />
            </RequireAuth>
          }
        />
        <Route
          path='/quizzes/:quizID/'
          exact
          element={
            <RequireAuth>
              <QuizDetail />
            </RequireAuth>
          }
        />
        <Route
          path='/quizzes/:quizID/attempt/'
          exact
          element={
            <RequireAuth>
              <QuizAttempt />
            </RequireAuth>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
