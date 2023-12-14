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
    published
    author {
      name
      born
      bookCount
    }
    genres
  }
}
`

export const addBook = gql`
  mutation AddBook($title: String!, $author: String!, $published: String!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      published
      genres
    }
  }
`;

export const editAuthor = gql `
  mutation editAuthor($name: String!, $born: String!){
    editAuthor(name: $name, born: $born){
       name
       born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      value
    }
  }
`

export const USER = gql`
query{
  me{
    username
    favoriteGenre
  }
}
`

export const getBooksByGenre = gql`
  query Query($genres: String) {
    booksByGenre(genres: $genres) {
      title
      published
    }
  }
`