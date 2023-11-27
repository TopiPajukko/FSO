/* eslint-disable semi */
/* eslint-disable quotes */
import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlog from "./components/NewBlog";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [refreshBlog, setRefreshBlog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [changeMessage, setChangeMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, [refreshBlog]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationMessage("Wrong username or password");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const addBlog = (blogObj) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObj).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setChangeMessage(
        `a new blog ${blogObj.title} by ${blogObj.author} added`,
      );
      setRefreshBlog(!refreshBlog);
      setTimeout(() => {
        setChangeMessage(null);
      }, 5000);
    });
  };

  const addLikes = async (id, blogObject) => {
    await blogService.update(id, blogObject);
    setRefreshBlog(!refreshBlog);
  };

  const deleteBlog = async (id) => {
    await blogService.remove(id);
    setRefreshBlog(!refreshBlog);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} className={"error"} />
        <form onSubmit={handleLogin}>
          <div>
            <p>username</p>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </div>
          <div>
            <p>password</p>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={changeMessage} className={"success"} />
      <p> {user.name} logged in </p>
      <button type="submit" onClick={handleLogout}>
        logout
      </button>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog newBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          addLikes={addLikes}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
