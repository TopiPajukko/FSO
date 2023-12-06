import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../notificationContext'
import { updateLike, deleteBlog, getComments } from '../request'
import { useUserValue } from '../userContext'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import CommentForm from './CommentForm'

const Blog = (({ blog }) => {
  const queryClient = useQueryClient()

  const user = useUserValue()

  const dispatch = useNotificationDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const result = useQuery({
    queryKey: ['comments'],
    queryFn: () => getComments(blog),
    options:
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  })

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLikeMutation = useMutation({ mutationFn: updateLike,
    onSuccess: (updatedLike) => {
      console.log('update', updatedLike)

      const blogs = queryClient.getQueryData({ gueryKey: 'blogs' })

      queryClient.setQueryData('blogs', blogs.map(blog =>
        blog.id === updatedLike.id ? updatedLike : blog
      ) )
    }
  })

  const handleLike = async (blog) => {
    addLikeMutation.mutate({ ...blog, likes: blog.likes + 1 })

    await dispatch({ type: 'showNotification', payload: `You add one like for: ${blog.title} !` })

    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
  }

  const deleteMutation = useMutation({ mutationFn: deleteBlog,
    onSuccess: (deletedBlog) => {
      const blogs = queryClient.getQueryData({ queryKey: 'blogs' })

      queryClient.setQueryData( 'blogs', blogs.filter(blog =>
        blog.id !== deletedBlog.id
      ) )
    }
  })

  const handleDelete = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      deleteMutation.mutate(blog)
    }
    await dispatch({ type: 'showNotification', payload: `You deleted: ${blog.title} !` })

    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
  }

  const showDelete = blog.user.username === user.username ? true : false
  console.log('blog', blog)
  console.log('user', user)

  if( result.isLoading ){
    return <div>loading comments...</div>
  }

  if( result.isError ){
    return<div>comment not available due to problem in server</div>
  }

  const comments = result.data

  return (
    <div style={blogStyle}  className='blog'>
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      <p>{blog.url}</p>
      <p>
        {blog.likes}
        <button onClick={() => handleLike(blog)}>likes</button>
      </p>
      <p>{blog.user!== null && blog.user.name}</p>
      {showDelete && <button onClick={() => handleDelete(blog)} id='remove-button'>remove</button>}
      <p>Comment:</p>
      {comments.map(comment =>
        <p key={comment.id} >{comment.content}</p>)}

      <CommentForm blog={blog}/>
    </div>
  )
})

export default Blog
