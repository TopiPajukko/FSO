/* eslint-disable no-case-declarations */

import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers:  {
    voteAnecdote(state, action){
      const id = action.payload.id
      const changeAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : changeAnecdote
      )
    },
    appendAnecdote(state, action){
      state.push(action.payload)
    },
    initAnecdotes(state, action){
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, initAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer 

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const initialAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(initAnecdotes(anecdotes))
  }
}

export const addVote = id => {
  return async dispatch => {
    const payload = await anecdoteService.updateVote(id)
    dispatch(voteAnecdote(payload))
  }
}

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'INCREMENT':
//     const indexOfVoted = state.findIndex(elem => elem.id === action.id)
//     state[indexOfVoted].votes += 1
//     state.sort((a, b) => b.votes - a.votes)
//     return state

//     case 'CREATE':
//     const newAnecdote = {
//       content: action.content,
//       id: getId(),
//       votes: 0
//     }
//     state.push(newAnecdote)
//     return state

//     default:
//     return state
//   }
// }

// // export const voteAnecdote = (id) => {
// //   return {
// //     type: 'INCREMENT',
// //     id:id
// //   }
// // }

// // export const addAnecdote = (content) => {
// //   return {
// //     type: 'CREATE',
// //     content: content
// //   }
// // }