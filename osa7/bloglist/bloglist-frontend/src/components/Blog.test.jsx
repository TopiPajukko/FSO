import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('content before clicking view button', () => {
  const blog = {
    title: 'Blogin testausta',
    author: 'Testaaja',
    url: 'http://localhost.com',
    likes: 100,
    user: {
      id: 'topi',
    },
  }
  const user = {
    id: 'topi',
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.whenHidden')

  expect(div).toHaveTextContent('Blogin testausta')
})

test('content after clicking view button', async () => {
  const oneBlog = {
    title: 'Blogin testausta',
    author: 'Testaaja',
    url: 'http://localhost.com',
    likes: 100,
    user: {
      id: 'topi',
    },
  }
  const user = {
    id: 'topi',
  }

  const { container } = render(<Blog blog={oneBlog} user={user} />)

  const div = container.querySelector('.whenShown')

  expect(div).toHaveTextContent('http://localhost.com')
  expect(div).toHaveTextContent('100')
})

test('likes button click twice', async () => {
  const oneBlog = {
    title: 'Blogin testausta',
    author: 'Testaaja',
    url: 'http://localhost.com',
    likes: 100,
    user: {
      id: 'topi',
    },
  }
  const user = {
    id: 'topi',
  }

  const mockHandler = jest.fn()

  render(<Blog blog={oneBlog} user={user} addLikes={mockHandler} />)

  const users = userEvent.setup()
  const button = screen.getByText('like')
  await users.click(button)
  await users.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
