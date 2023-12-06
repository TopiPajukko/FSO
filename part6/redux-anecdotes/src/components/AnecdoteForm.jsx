import { useDispatch } from "react-redux"
import { addAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const submitAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdotesInput.value
        event.target.anecdotesInput.value = ''
        dispatch(addAnecdote(content))
        dispatch(setNotification(`You added "${content}"!`, 5))
      }

    return (
        <div>
            <h2>create new anecdote</h2>
            <form onSubmit={submitAnecdote}>
                <div>
                    <input name='anecdotesInput' />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm