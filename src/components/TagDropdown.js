import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import { handleError } from '../utiles/handleError';

const TagDropdown = ({ value, onChange }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

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

  return (
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
      onChange={(e, { value }) => onChange(value)}
      value={value}
    />
  );
};

export default TagDropdown;
