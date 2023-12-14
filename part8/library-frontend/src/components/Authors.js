import { useMutation, useQuery } from '@apollo/client'
import { allAuthors, editAuthor } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editBorn ] = useMutation(editAuthor, {
    refetchQueries: [{ query: allAuthors}]
  })

const result = useQuery(allAuthors, {
  pollInterval: 2000
})

  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    console.log('edit author')

    editBorn({variables: {name, born}})

    setName('')
    setBorn('')
  }


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!props.token ? null :
      <div>
        <h2>Edit birthyear</h2>
       <form onSubmit={submit}>
       <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => 
              <option value={a.name} key={a.name}>
                {a.name}
              </option>
            )}
          </select>
          <div>
            name
            <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          </div>
          <div>
            born
            <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
           <button type="submit">edit birthyear</button>
          </div>
       </form>
      </div>
    }
    </div>
  )
}

export default Authors
