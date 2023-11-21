/* eslint-disable react/prop-types */
import { useState } from 'react'

const Anekdootit = (props) => {
  return(
    <div>
      <div>{props.anekdootit}</div>
      <div>{props.votes} votes</div>
    </div>
  )
}

const Button = (props) => {
  return (
  <div>
    <button onClick={props.handleClick}>{props.text}</button>
  </div>
  )
}

const MostVotes = (props) => {
  return (
    <div>
      <div>{props.anekdootit}</div>
      <div>{props.max} votes</div>
    </div>
  )
}

const App = () => {
  const anekdootit = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState(Array(anekdootit.length).fill(0))

  const nextClick = () => {
    setSelected(Math.floor(Math.random() * anekdootit.length))
  }

  const voteClick = () => {
    const newVotes = [...voted]
    newVotes[selected] += 1
    setVoted(newVotes)
  }

  const max = Math.max(...voted)
  const index = voted.indexOf(max)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anekdootit anekdootit={anekdootit[selected]} votes={voted[selected]}/>
      <Button handleClick={nextClick} text='next anecdote'/>
      <Button handleClick={voteClick} text='vote'/>
      <h1>Anecdote with the most votes</h1>
      <MostVotes anekdootit={anekdootit[index]} max={max} />
    </div>
  )
}

export default App;
