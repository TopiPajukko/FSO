import { gql } from "@apollo/client"

export const allAuthors = gql`
query AllAuthors {
  allAuthors {
    born
    bookCount
    name
  }
}
`

export const allBooks = gql`
query AllBooks {
  allBooks {
    title
    author
    published
  }
}
`

export const addBook = gql `
mutation AddBook($title: String!, $author: String!, $published: String!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    author
    genres
    id
    published
    title
  }
}
`

export const editAuthor = gql `
mutation Mutation($name: String!, $setBornTo: String!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
  }
}
`