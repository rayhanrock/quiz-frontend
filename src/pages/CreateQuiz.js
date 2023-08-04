import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { handleError } from '../utiles/handleError';
import { useSelector } from 'react-redux';

import {
  Form,
  Input,
  TextArea,
  Button,
  Dropdown,
  Checkbox,
  List,
  Icon,
} from 'semantic-ui-react';

import withLoading from '../hoc/WithLoading';
import { toast } from 'react-toastify';

const CreateQuiz = ({ isLoading, startLoading, stopLoading }) => {
  const auth = useSelector((state) => state.auth);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    time_limit: '',
    passing_marks_percentage: '',
    tags: [],
    categories: [],
    questions: [],
  });

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

    stopLoading();
  }, []);

  const handleCategoryChange = (e, { value }) => {
    setQuizData((prevData) => ({ ...prevData, categories: value }));
  };
  const handleTagChange = (e, { value }) => {
    setQuizData((prevData) => ({ ...prevData, tags: value }));
  };

  const handleInputChange = (e, { name, value }) => {
    setQuizData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddQuestion = () => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          text: '',
          type: 'MC',
          points: 1,
          answers: [{ text: '', is_correct: false }],
        },
      ],
    }));
  };

  const handleAddAnswer = (questionIndex) => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const newAnswer = { text: '', is_correct: false };
      updatedQuestions[questionIndex].answers.push(newAnswer);
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleQuestionChange = (questionIndex, fieldName, fieldValue) => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [fieldName]: fieldValue,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (
    questionIndex,
    answerIndex,
    fieldName,
    fieldValue
  ) => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedAnswers = [...updatedQuestions[questionIndex].answers];
      updatedAnswers[answerIndex] = {
        ...updatedAnswers[answerIndex],
        [fieldName]: fieldValue,
      };
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: updatedAnswers,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleSubmit = () => {
    const filteredQuestions = quizData.questions
      .map((question) => {
        return {
          ...question,
          answers: question.answers.filter(
            (answer) => answer.text.trim() !== ''
          ),
        };
      })
      .filter((question) => question.text.trim() !== '');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/`,
        {
          ...quizData,
          questions: filteredQuestions,
        },
        config
      )
      .then((response) => {
        toast.success('Quiz created successfully.');
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const handleRemoveQuestion = (questionIndex) => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions.splice(questionIndex, 1);
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedAnswers = [...updatedQuestions[questionIndex].answers];
      updatedAnswers.splice(answerIndex, 1);
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: updatedAnswers,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  return (
    !isLoading && (
      <Form>
        <Form.Field required>
          <label>Title</label>
          <Input
            name='title'
            value={quizData.title}
            onChange={handleInputChange}
            placeholder='Enter quiz title'
          />
        </Form.Field>
        <Form.Field required>
          <label>Description</label>
          <TextArea
            name='description'
            value={quizData.description}
            onChange={handleInputChange}
            placeholder='Enter quiz description'
          />
        </Form.Field>

        <Form.Group>
          <Form.Field
            width={8}
            required>
            <label>Time limit</label>
            <Input
              min={1}
              placeholder='30'
              type='number'
              name='time_limit'
              value={quizData.time_limit}
              onChange={handleInputChange}
            />
          </Form.Field>
          <Form.Field
            width={8}
            required>
            <label>Passing mark parcentage</label>
            <Input
              mini={1}
              max={100}
              type='number'
              placeholder='33%'
              name='passing_marks_percentage'
              value={quizData.passing_marks_percentage}
              onChange={handleInputChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field required>
          <label>Category</label>
          <Dropdown
            name='category'
            value={quizData.categories}
            onChange={handleCategoryChange}
            placeholder='Select categories'
            fluid
            multiple
            selection
            options={categories}
          />
        </Form.Field>
        <Form.Field required>
          <label>Tags</label>
          <Dropdown
            name='tags'
            value={quizData.tags}
            onChange={handleTagChange}
            placeholder='Select tags'
            fluid
            multiple
            selection
            options={tags}
          />
        </Form.Field>

        <List divided>
          {quizData.questions.map((question, questionIndex) => (
            <List.Item
              key={questionIndex}
              style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <List.Icon name='question circle' />
              <List.Content>
                <Form.Field>
                  <label>
                    Question {questionIndex + 1}
                    <Icon
                      style={{ marginLeft: '1rem', cursor: 'pointer' }}
                      color='red'
                      name='close'
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    />
                  </label>
                  <Form.Input
                    name='text'
                    value={question.text}
                    onChange={(e, { name, value }) =>
                      handleQuestionChange(questionIndex, name, value)
                    }
                    placeholder='Enter question text'
                  />
                </Form.Field>
                <Form.Field required>
                  <Form.Input
                    label='Points'
                    name='points'
                    type='number'
                    value={question.points}
                    onChange={(e, { name, value }) =>
                      handleQuestionChange(questionIndex, name, value)
                    }
                    placeholder='Enter question points'
                  />
                </Form.Field>
                <List.List style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  {question.answers.map((answer, answerIndex) => (
                    <List.Item key={answerIndex}>
                      <List.Icon name='idea' />
                      <List.Content>
                        <Form.Field>
                          <label>
                            Answer {questionIndex + 1}.{answerIndex + 1}
                            {answerIndex > 1 && (
                              <Icon
                                style={{
                                  marginLeft: '1rem',
                                  cursor: 'pointer',
                                }}
                                color='red'
                                name='close'
                                onClick={() =>
                                  handleRemoveAnswer(questionIndex, answerIndex)
                                }
                              />
                            )}
                          </label>
                          <Form.Input
                            name='text'
                            value={answer.text}
                            onChange={(e, { name, value }) =>
                              handleAnswerChange(
                                questionIndex,
                                answerIndex,
                                name,
                                value
                              )
                            }
                            placeholder='Enter answer text'
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            type='checkbox'
                            name='is_correct'
                            checked={answer.is_correct}
                            onChange={(e, { name, checked }) =>
                              handleAnswerChange(
                                questionIndex,
                                answerIndex,
                                name,
                                checked
                              )
                            }
                            label='Check if the answer is correct.'
                          />
                        </Form.Field>
                      </List.Content>
                    </List.Item>
                  ))}
                  <Button
                    style={{ marginTop: '1rem' }}
                    onClick={() => handleAddAnswer(questionIndex)}>
                    Add Answer
                  </Button>
                </List.List>
              </List.Content>
            </List.Item>
          ))}
          <Button onClick={handleAddQuestion}>Add More Question</Button>
          <Button
            onClick={handleSubmit}
            secondary>
            Submit
          </Button>
        </List>
      </Form>
    )
  );
};

export default withLoading(CreateQuiz);
