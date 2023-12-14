const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const cors = require ('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { GraphQLError } = require('graphql')
mongoose.set('strictQuery', false)

const Author = require('./models/author')
const Book = require ('./models/book')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
type User {
  username: String!
  favoriteGenre: String
  id: ID!
}
type Token {
  value: String!
}
  type Author {
    name: String!
    born: String
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published:String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      born: String!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genres: String): [Book!]!
    me: User
    booksByGenre(genres: String): [Book!]!
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
        const foundAuthor = await Author.findOne({ name: args.author })
  
        if(args.author && args.genres){
          return await Book.find( {author: foundAuthor.id , genres:{ $in: args.genres }} ).populate('author')
        }
        else if(args.author){
          return await Book.find({ author: foundAuthor.id }).populate('author')
        }
        else if(args.genres){
          return await Book.find({ genres:{ $in: args.genres }}).populate('author')
        }else{
          return await Book.find({}).populate('author')
        } 
      },
      allAuthors: async () => {
        return Author.find({}).populate('books')
      },
      me: async (root, args, context) => {
        return context.currentUser
      },
      booksByGenre: async (root, args) => {
        const books = await Book.find({ genres: { $in: args.genres } }).populate('author');
        return books.map(book => ({
          title: book.title,
          published: book.published,
        }));
      }
    },
    Author: {
      bookCount: async(root) => {
       const foundAuthor = await Author.findOne({ name: root.name })
       const foundBooks = await Book.find({ author : foundAuthor.id })
       return foundBooks.length 
      }
     }, 
     Mutation: {
      addBook: async (root, args, context) => {
  
         const existAuthor = await Author.findOne({ name: args.author })
         const currentUser = context.currentUser
  
         if(!currentUser){
          throw new GraphQLError('no authentication', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
         }
  
         if(!existAuthor){
            const newAuthor = new Author({ name: args.author, })
            try{
              await newAuthor.save()
            } catch (error) {
              throw new GraphQLError('saving author failed', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args,
                  error
                }
              })
            }
         }
          const foundAuthor = await Author.findOne({ name: args.author })
          const book = new Book({ 
            ...args, 
            author: foundAuthor.id,
           })
          try{
            const newBook = await book.save()
         
            foundAuthor.books = foundAuthor.books.concat(newBook.id)
            await foundAuthor.save()

          } catch (error) {
            throw new GraphQLError('saving book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
            })
        } 
        return book
      },
      editAuthor: async (root, args, context) => {
  
        const author = await Author.findOne({ name: args.name })
        const currentUser = context.currentUser
  
         if(!currentUser){
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
         }
  
        if(!author){
          return null
        }else{
        author.born = args.born
        try{
           await author.save()
        } catch (error) {
          throw new GraphQLError('saving born failed',{
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        return author
        }
      },
      createUser: async (root, args) => {
        const user = new User({ 
          username: args.username,
          favoriteGenre: args.favoriteGenre
         })
  
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if( !user || args.password != 'nakki123' ){
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        const userForToken = {
          username: user.username,
          id: user._id
        }
  
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
  }

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})