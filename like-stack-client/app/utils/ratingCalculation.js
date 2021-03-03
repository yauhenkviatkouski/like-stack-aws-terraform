import { config } from '../config';

export const ratingCalculation = (votes, acceptedAnswers, answers) => {
  const weight = config.userRatingPointsWeight;
  return (
    weight.votes * votes +
    weight.acceptedAnswers * acceptedAnswers +
    weight.answers * answers
  );
};
