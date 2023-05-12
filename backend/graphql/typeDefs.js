import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
  type Query {
    # hello(x: Int, y: Int): String
    # comment: [Comment]
    getEntries(page: Int): EntriesPayload
    getEntrie(entrieId: String): Entrie
    welcome: String
    # test(id: ID, comment: String): [Comment]
  }

  type Mutation {
    test(id: ID, comment: String): [Comment]
    register(
      username: String
      email: String
      password: String
      password2: String
    ): AuthPayload
    login(email: String, password: String): AuthPayload
    postEntrie(post: String): Entrie
    postEntrieComment(
      entrieId: String
      message: String
      parentId: String
    ): Comment
    updateEntrie(message: String, uniqId: String): Comment
    voteComment(entrieId: String): VoteEntrie
    voteEntry(entrieId: String): VoteEntrie
    deleteEntrie(uniqId: String): DeleteEntrie
  }

  type EntriesPayload {
    data: [Entrie]
    meta: EntriesMeta
  }

  type EntriesMeta {
    total: Int
    lastPage: Int
    currentPage: Int
    perPage: Int
    prev: Int
    next: Int
  }

  type User {
    id: Int
    username: String
    email: String
    joined: DateTime
    lastSeen: DateTime
    entries: [Entrie]
    likes: [Like]
    comments: [Comment]
  }

  type AuthPayload {
    id: Int
    username: String
    email: String
    lastSeen: String
    joined: DateTime
    token: String
  }

  type Entrie {
    id: Int
    uniqId: String
    title: String
    post: String
    added: DateTime
    votes: Int
    userId: Int
    comments: [Comment]
    User: User
  }

  type Comment {
    id: Int
    uniqId: String
    comment: String
    post: String
    createdAt: DateTime
    updatedAt: DateTime

    userId: Int
    entrieId: String
    parentId: String

    likeByMe: Boolean
    likeCount: Int

    children: [Comment]
    likes: [Like]
    User: User
    error: String
  }

  type Like {
    userId: Int
    entrieId: String
  }

  type VoteEntrie {
    addLike: Boolean
    votes: Int
  }

  type DeleteEntrie {
    uniqId: String
  }

  scalar DateTime
`;
