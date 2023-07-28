import { connect } from 'react-redux';
import * as actions from '../redux/auth/action/actionCreate';

import {
  Button,
  Form,
  Divider,
  Grid,
  Header,
  Message,
  Loader,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { isEmpty } from '../utiles/isEmpty';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const Registration = ({ signUp, isAuthenticated, id, isStuff, isLoading }) => {
  if (isAuthenticated && isStuff) {
    return <Navigate to='/admin/' />;
  } else if (isAuthenticated) {
    return <Navigate to='/home/' />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const cpassword = event.target.cpassword.value;

    if (isEmpty(username)) {
      toast.error('Username is required !');
    } else if (isEmpty(password)) {
      toast.error('Password is required !');
    } else if (isEmpty(cpassword)) {
      toast.error('Confirm Password is required !');
    } else if (isEmpty(email)) {
      toast.error('Email is required !');
    } else {
      if (password !== cpassword) {
        toast.error('Password and Confirm Password must be same !');
      } else {
        signUp(username, email, password, cpassword);
      }
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
          <Header.Subheader style={{ marginTop: '15px', marginBottom: '30px' }}>
            Welcome to our exciting Participant Quiz! Are you ready to put your
            knowledge to the test and have a blast while doing it?{' '}
          </Header.Subheader>
        </Header>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Username</label>
            <input
              name='username'
              type='text'
              placeholder='rayhanrock'
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              name='email'
              type='email'
              placeholder='example@mail.com'
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              name='password'
              type='password'
              placeholder='At least 6 characters'
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm password</label>
            <input
              name='cpassword'
              type='password'
              placeholder='Enter your password again'
            />
          </Form.Field>

          <Button
            secondary
            className='fluid'
            type='submit'>
            {isLoading ? (
              <Loader
                active
                inline='centered'
                size='tiny'
              />
            ) : (
              'Sign Up'
            )}
          </Button>
          <Divider horizontal>Or</Divider>
          <Message
            style={{ textAlign: 'center' }}
            visible>
            Already have an account? <Link to='/'>Login</Link>
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
    signUp: (username, email, password, confirm_password) =>
      dispatch(actions.authSignUp(username, email, password, confirm_password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
