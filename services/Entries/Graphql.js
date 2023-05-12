import { gql } from "graphql-request";

export const WELCOME = gql`
  query Welcome {
    welcome
  }
`;

export const POST_ENTRIE = gql`
  mutation PostEntrie($post: String) {
    postEntrie(post: $post) {
      post
      uniqId
      added
      userId
    }
  }
`;

export const GET_ENTRIES = gql`
  query GetEntries($page: Int) {
    getEntries(page: $page) {
      data {
        added
        post
        uniqId
        votes
        User {
          username
        }
      }
      meta {
        total
        lastPage
        currentPage
        perPage
        prev
        next
      }
    }
  }
`;

export const POST_COMMENT = gql`
  mutation PostEntrieComment(
    $message: String
    $entrieId: String
    $parentId: String
  ) {
    postEntrieComment(
      message: $message
      entrieId: $entrieId
      parentId: $parentId
    ) {
      comment
      parentId
      createdAt
      uniqId
      likeByMe
      likeCount
      User {
        username
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($message: String, $uniqId: String) {
    updateEntrie(message: $message, uniqId: $uniqId) {
      comment
      error
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($uniqId: String) {
    deleteEntrie(uniqId: $uniqId) {
      uniqId
    }
  }
`;

export const VOTE_COMMENT = gql`
  mutation VoteComment($entrieId: String) {
    voteComment(entrieId: $entrieId) {
      addLike
    }
  }
`;

export const VOTE_ENTRY = gql`
  mutation VoteEntry($entrieId: String) {
    voteEntry(entrieId: $entrieId) {
      addLike
      votes
    }
  }
`;

export const GET_ENTRIE = gql`
  query GetEntrie($entrieId: String) {
    getEntrie(entrieId: $entrieId) {
      uniqId
      post
      added
      votes
      User {
        username
        joined
        lastSeen
      }
      comments {
        comment
        uniqId
        parentId
        createdAt
        likeByMe
        likeCount
        User {
          username
          joined
          lastSeen
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      username
      email
      lastSeen
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $username: String
    $email: String
    $password: String
    $password2: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      password2: $password2
    ) {
      id
      username
      email
      joined
      token
    }
  }
`;
