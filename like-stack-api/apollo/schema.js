const { gql } = require('apollo-server');

module.exports = gql`
  type Question {
    header: String
    id: ID!
    body: String
    tags: [String]
    answers: [Answer]
    lastActivityDate: String
    author: User!
  }

  type Answer {
    id: ID!
    body: String
    votes: [User]
    question: Question
    author: User!
    lastActivityDate: String
    isAccepted: Boolean
  }

  type User {
    id: ID!
    name: String
    surname: String
    email: String
    nick: String
    workPosition: String
    experience: Int
    mainLang: String
    answers: [Answer]
    questions: [Question]
  }

  input createUserInput {
    name: String
    surname: String
    email: String
    password: String
    nick: String
    workPosition: String
    experience: Int
    mainLang: String
  }

  input createQuestionInput {
    header: String
    body: String
    tags: [String]
    author: String
  }

  input createAnswerInput {
    body: String
    question: String
    author: String
  }

  type QuestionsPage {
    hasMore: Boolean
    questions: [Question]
  }

  type Query {
    question(id: ID, authorId: String): Question
    questionsPage(skip: Int, limit: Int, header: String): QuestionsPage
    user(id: ID!): User
    isSignedInUser: User
  }

  type Mutation {
    signUp(user: createUserInput): User
    signIn(email: String, password: String): User
    signOut: Boolean
    createQuestion(question: createQuestionInput): Question
    createAnswer(answer: createAnswerInput): Answer
    acceptAnswer(answerId: String): Boolean
    voteForAnswer(answerId: String, userId: String): [String]
  }
`;
