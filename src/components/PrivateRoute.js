import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ redirectPath = '/', children }) => {
  const state = useSelector((state) => state.auth);
  if (state.token === null) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  } else {
    return children;
  }
};

export const StuffRoute = ({ redirectPath = '/', children }) => {
  const state = useSelector((state) => state.auth);
  if (state.token === null) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  if (!state.isStuff) {
    return (
      <Navigate
        to='/quizzes/'
        replace
      />
    );
  } else {
    return children;
  }
};
