import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Divider,
  Grid,
  Header,
  Message,
  Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../redux/auth/action/actionCreate';
import { isEmpty } from '../utiles/isEmpty';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const Login = ({ login, isAuthenticated, isLoading, id, isStuff }) => {
  if (isAuthenticated && isStuff) {
    return <Navigate to='/dashboard/' />;
  } else if (isAuthenticated) {
    return <Navigate to='/quizzes/' />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const username = event.target.username.value;
    const password = event.target.password.value;

    if (isEmpty(username)) {
      toast.error('Username is required !');
    } else if (isEmpty(password)) {
      toast.error('Password is required !');
    } else {
      login(username, password);
    }
  };

  return (
    <Grid centered>
      <Grid.Column width={8}>
        <Header
          style={{ marginTop: '15px', marginBottom: '30px' }}
          textAlign='center'
          as='h2'
          dividing>
          QuizHub
          <Header.Subheader>Hello, who’s this?</Header.Subheader>
        </Header>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Username</label>
            <input
              type='text'
              name='username'
              placeholder='example@mail.com'
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='At least 6 characters'
            />
          </Form.Field>
          <Button
            secondary
            className='fluid'
            type='submit'>
            {isLoading ? (
              <Loader
                active
                inline
                size='tiny'
              />
            ) : (
              'Login'
            )}
          </Button>
          <Divider horizontal>Or</Divider>
          <Message
            style={{ textAlign: 'center' }}
            visible>
            Don't have an account? <Link to='/registration/'>Sign up</Link>
          </Message>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isLoading: state.auth.loading,
    id: state.auth.id,
    isStuff: state.auth.isStuff,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) =>
      dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
