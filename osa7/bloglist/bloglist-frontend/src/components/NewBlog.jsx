import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createBlog } from '../request'
import { useNotificationDispatch } from '../notificationContext'
import {  Form, Button } from 'react-bootstrap'

const NewBlog = () => {
  const queryClient = useQueryClient()

  const dispatch = useNotificationDispatch()

  const newBlogMutation = useMutation({ mutationFn: createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog) )
    },
    onError: () => {
      dispatch({ type: 'showNotification', payload: 'fail to create the blog' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  })

  const addBlog = async (event) => {
    event.preventDefault()

    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value

    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''

    newBlogMutation.mutate({ title, author, url })
    console.log('new blog')

    await dispatch({ type: 'showNotification', payload: `You added ${title} by ${author} !` })

    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <div>
            <Form.Label> title:</Form.Label>
            <input
              type="text"
              name="title"
              placeholder='write title here'
            />
          </div>
          <div>
            <Form.Label> Author:</Form.Label>
            <input
              type="text"
              name="author"
              placeholder='write author here'
            />
          </div>
          <div>
            <Form.Label> Url:</Form.Label>
            <input
              type="url"
              name="url"
              placeholder='write url here'
            />
          </div>
          <Button type="submit" id='create-button'>create</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default NewBlog