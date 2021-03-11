const SERVER_LINK =
  window.location.hostname !== 'localhost'
    ? 'https://like-stack-api-dock.herokuapp.com/'
    : 'http://localhost:3005/';

export const config = {
  SERVER_LINK,
  LIMIT_QUESTIONS: 5,
  userRatingPointsWeight: {
    votes: 5,
    answers: 1,
    acceptedAnswers: 20,
  },
};
