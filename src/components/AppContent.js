import React from 'react';
import { Route } from 'react-router-dom';
import Quizzes from '../pages/Quizzes';
import Dashboard from '../pages/Dashboard';
import { Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { Loader } from 'semantic-ui-react';
import { StuffRoute } from './PrivateRoute';
import QuizDetail from '../pages/QuizDetails';
import QuizAttempt from '../pages/QuizAttempt';
import SideMenuLayout from '../layout/SideMenuLayout';
import UserStatistics from '../pages/UserStatistics';
import UserProfile from '../pages/UserProfile';
import Leaderboard from '../pages/Leaderboard';
import CreateQuiz from '../pages/CreateQuiz';

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
          }>
          <Route
            path='/dashboard/'
            element={<CreateQuiz />}
          />
        </Route>

        <Route
          path='/quizzes/'
          exact
          element={<Quizzes />}
        />
        <Route
          path='/user/'
          exact
          element={<SideMenuLayout />}>
          <Route
            path='/user/'
            element={<UserProfile />}
          />
          <Route
            path='/user/statistics/'
            element={<UserStatistics />}
          />
        </Route>

        <Route
          path='/leaderboard/'
          exact
          element={<Leaderboard />}
        />

        <Route
          path='/quizzes/:quizID/'
          exact
          element={<QuizDetail />}
        />
        <Route
          path='/quizzes/:quizID/attempt/'
          exact
          element={<QuizAttempt />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
