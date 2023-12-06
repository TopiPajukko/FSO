/* eslint-disable quotes */
import { useEffect, useRef, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './notificationContext'
import UserContext from './userContext'
import { getBlogs, setToken } from './request'
import UsersInfo from './components/UsersInfo'
import { Routes, Route } from 'react-router-dom'
import SingleUser from './components/SingleUser'
import SingleBlog from './components/SingleBlog'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Form, Button } from 'react-bootstrap'

const App = () => {

  const padding = {
    padding: 5
  }

  const [user, userDispatch] = useContext(UserContext)
  const dispatch = useNotificationDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      userDispatch({ type: 'setUser', payload: user })
      setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      setToken(user.token)
      userDispatch({ type: 'setUser', payload: user })
    } catch (exception) {
      dispatch({ type: 'showNotification', payload: 'Wrong username or password' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    userDispatch({ type: 'clearUser' })
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    options:
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  })
  console.log('1111', result)

  if( result.isLoading ){
    return <div>loading data...</div>
  }

  if( result.isError ){
    return<div>blog service not available due to problem in server</div>
  }

  const blogs = result.data

  const Home = () => {
    return (
      <div id="content">
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <NewBlog />
        </Togglable>

        <h2>blogs</h2>
        {blogs.map(blog =>
          <p key={blog.id}>
            <Link to={`/blogs/${blog.id}`}> {blog.title}</Link> </p>
        )}
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>login</h2>
        <Notification className="error" />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
            />
            <Form.Label>password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
            />
            <Button variant="primary" type="submit">
            login
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }

  return (
    <div className="container">

      <div id='navbar'>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">home</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <p>{user.name} logged in </p>
          <Button type="submit" onClick={handleLogout}>Logout</Button>
        </Navbar>
      </div>
      <Notification className="success"/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/users' element={<UsersInfo/>} />
        <Route path="/users/:id" element={<SingleUser />} />
        <Route path="/blogs/:id" element={<SingleBlog blogs={blogs}/>} />
      </Routes>
    </div>
  )
}

export default App
