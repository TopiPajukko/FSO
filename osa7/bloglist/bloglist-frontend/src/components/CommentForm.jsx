import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '../request'

const CommentForm = ( { blog } ) => {
  const queryClient = useQueryClient()

  const newCommentMutation = useMutation({ mutationFn: addComment,
    onSuccess: (newComment) => {
      const comments = queryClient.getQueryData('comments')
      queryClient.setQueryData('comments', comments.concat(newComment) )
    }
  })

  const addCommentFn = async (event) => {
    event.preventDefault()

    const content = event.target.comment.value

    event.target.comment.value = ''
    console.log(blog, content)

    newCommentMutation.mutate({ blog, content })
  }

  return (
    <div>
      <form onSubmit={addCommentFn}>
        <div>
            kommentti:
          <input
            type="text"
            name="comment"
            placeholder='write your comment here'
          />
        </div>
        <button type="submit" id='create-button'>Add comment</button>
      </form>
    </div>
  )
}

export default CommentForm