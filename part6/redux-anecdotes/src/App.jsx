import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initialAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initialAnecdotes())
  },[dispatch])

  return (
    <div>
      <Notification/>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App