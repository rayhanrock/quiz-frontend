import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import { handleError } from '../utiles/handleError';

const CategoryDropdown = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);

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
  }, []);

  return (
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
      onChange={(e, { value }) => onChange(value)}
      value={value}
    />
  );
};

export default CategoryDropdown;
