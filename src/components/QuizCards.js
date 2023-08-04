import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

const QuizCard = ({ quizzes }) => {
  const shortenedDescription = (longString) => {
    const words = longString.split(' ');
    const shortenedWords =
      words.length > 30 ? words.slice(0, 30).join(' ') + '...' : longString;

    return shortenedWords;
  };
  return (
    <Card.Group
      stackable
      itemsPerRow={3}>
      {quizzes.map((quiz) => (
        <Card
          link
          as={NavLink}
          to={`/quizzes/${quiz.id}`}>
          <Card.Content>
            <Card.Header>{quiz.title}</Card.Header>
            <Card.Meta>Time limit {quiz.time_limit}</Card.Meta>
            <Card.Description>
              {shortenedDescription(quiz.description)}
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default QuizCard;
