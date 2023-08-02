import React, { useState } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import {
  Form,
  Input,
  Button,
  Grid,
  Header,
  Message,
  Segment,
  Confirm,
} from 'semantic-ui-react';
import withLoading from '../hoc/WithLoading';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { handleError } from '../utiles/handleError';

const UserProfile = ({ startLoading, isLoading, stopLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [userData, setUserData] = useState({});
  const inputRef = useRef();

  const handleEditClick = () => {
    setIsEditing(true);
    inputRef.current.focus();
    toast.info('You can now edit your profile.');
  };

  useEffect(() => {
    startLoading();
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/account/users/${auth.id}/`)
      .then((response) => {
        setUserData(response.data);
        stopLoading();
      })
      .catch((error) => {
        handleError(error);
        stopLoading();
      });
  }, []);

  const handleSaveClick = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    };
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/account/users/${auth.id}/`,
        userData,
        config
      )
      .then((response) => {
        setUserData(response.data);
        toast.success('Profile updated successfully.');
      })
      .catch((error) => {
        handleError(error);
      });

    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenderChange = (e, { value }) => {
    setUserData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  const handleConfirm = () => {
    setConfirmSubmit(false);
    handleSaveClick();
  };
  const showConfirmSubmit = () => {
    setConfirmSubmit(true);
  };
  const handleCancel = () => {
    setConfirmSubmit(false);
  };

  const genderOptions = [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
    { text: 'Other', value: 'other' },
  ];

  return (
    !isLoading && (
      <div>
        <Message
          success
          header='Basic Info: '
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
                  User Name :
                </Header>
                <span style={{ paddingLeft: '10px' }}>{userData.username}</span>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Status :
                </Header>
                <span style={{ paddingLeft: '10px', display: 'inline-block' }}>
                  {userData.is_active ? 'Active' : 'Inactive'}
                </span>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Join date :
                </Header>
                <span style={{ paddingLeft: '10px' }}>
                  {new Date(userData.date_joined).toLocaleString()}
                </span>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                  as='h4'>
                  Last login :
                </Header>
                <span style={{ paddingLeft: '10px' }}>
                  {new Date(userData.last_login).toLocaleString()}
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>First Name</label>
                <Input
                  placeholder='First Name'
                  name='first_name'
                  value={userData.first_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  ref={inputRef}
                />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <Input
                  placeholder='Last Name'
                  name='last_name'
                  value={userData.last_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field width={8}>
                <label>Email</label>
                <Input
                  placeholder='example@mail.com'
                  name='email'
                  value={userData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Field>
              <Form.Select
                label='Gender'
                name='gender'
                value={userData.gender}
                options={genderOptions}
                placeholder='Gender'
                onChange={isEditing ? handleGenderChange : null}
                width={8}
              />
            </Form.Group>

            <Form.Group>
              <Form.Field width={8}>
                <label>Address</label>
                <Input
                  placeholder='College road, Sylhet'
                  name='address'
                  value={userData.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Field>
              <Form.Field width={8}>
                <label>Phone</label>
                <Input
                  placeholder='01XXXXXXXX'
                  name='contact_number'
                  value={userData.contact_number}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </Form.Field>
            </Form.Group>
            <Form.TextArea
              name='biography'
              value={userData.biography}
              readOnly={!isEditing}
              label='Biography'
              onChange={handleChange}
              placeholder='Tell us more about you...'
            />
            {isEditing ? (
              <Button
                fluid
                secondary
                onClick={showConfirmSubmit}>
                Save
              </Button>
            ) : (
              <Button
                fluid
                secondary
                onClick={handleEditClick}>
                Edit
              </Button>
            )}
            <Confirm
              className='secondary'
              open={confirmSubmit}
              cancelButton='Nope'
              confirmButton='Yeah'
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          </Form>
        </Segment>
      </div>
    )
  );
};

export default withLoading(UserProfile);
