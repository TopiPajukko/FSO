const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require ('bcrypt')
const app = require('../app')
const Blog = require ('../models/blog')
const { initial } = require('lodash')
const User = require('../models/user')
const api = supertest(app)

const initialBlogs = [
{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
},
{
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
},
{
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
  likes: 10,
  __v: 0
},
{
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
},
{
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}]

beforeEach(async () => {  
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("nakki", 10)
    const user = new User({
       username: "topi",
       name: "topi",
       blogs: [],
       passwordHash
    })
  
    await user.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs
    .map(blog => new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes ? blog.likes : 0
    }))

    const savePromises = blogObjects.map(blog => blog.save());
    await Promise.all(savePromises)
    }, 1000)

describe('when there is initially some blogs saved', () => {

  test('correct amount of blogs are returned as JSON', async () => {

    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is id', async () => {

    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
  })

  test('blog post can be added with POST -method', async () => {

    const user = {
      username: "topi",
      password: "nakki",
    }

    const userLogin = await api
    .post('/api/login')
    .send(user)

    const newBlog = (
      {
        title: 'Jarkon Elama',
        author: 'Jarkko Tuomonen',
        url: 'www.jarkko.com',
        likes: 8
      }
    )
    await api.post('/api/blogs').send(newBlog).set('Authorization', `bearer ${userLogin.body.token}`)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('if likes are not defined then value is set to 0', async () => {

    const user = {
      username: "topi",
      password: "nakki",
    }

    const userLogin = await api
    .post('/api/login')
    .send(user)
    
    const newBlog = (
      {
        title: 'Jarkon Elama',
        author: 'Jarkko Tuomonen',
        url: 'www.jarkko.com',
      }
    )
    await api.post('/api/blogs').send(newBlog).set('Authorization', `bearer ${userLogin.body.token}`)

    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length -1].likes).toEqual(0)
  })

  test('return 400 if title or url is not defined', async () => {

    const user = {
      username: "topi",
      password: "nakki",
    }

    const userLogin = await api
    .post('/api/login')
    .send(user)
    
    const newBlog = new Blog(
      {
        title: 'Jarkon Elama',
        author: 'Jarkko Tuomonen',
        url: 'www.jarkko.com',
      }
    )
    await api.post('/api/blogs').send(newBlog).expect(400).set('Authorization', `bearer ${userLogin.body.token}`)
  })
})

describe('deleting a blog', () => {

  test('blog can be deleted', async () => {
    const user = {
      username: "topi",
      password: "nakki",
    }

    const userLogin = await api
    .post('/api/login')
    .send(user)
    
    const newBlog =
      {
        title: 'Jarkon Elama',
        author: 'Jarkko Tuomonen',
        url: 'www.jarkko.com',
      }
      
    const post = await api.post('/api/blogs').send(newBlog).set('Authorization', `bearer ${userLogin.body.token}`)
    await api.delete(`/api/blogs/${post.body.id}`).set('Authorization', `bearer ${userLogin.body.token}`)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('updating a blog', () => {

  test('blog likes can be updated', async () => {
    const blogs = await api.get('/api/blogs')
    const likesBefore = blogs.body[1].likes

    const newBlog = {
      title: blogs.body[1].title,
      author: blogs.body[1].author,
      url: blogs.body[1].url,
      likes: 223
    }

    await api.put(`/api/blogs/${blogs.body[1].id}`).send(newBlog)
    const updatedBlogs = await api.get('/api/blogs')
    const likesAfter = updatedBlogs.body[1].likes

    expect(likesAfter).not.toEqual(likesBefore)
  })
})

describe('user tests', () => {
  test('cant create invalid user', async () => {

    const newUser = {
        username: 'to',
        name: 'topi',
        password: 'nakki'
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)

    expect(result.body.error).toContain('password or username must be at least 3 characters long')
  }, 1000)
})

afterAll(async () => {
  await mongoose.connection.close()
})