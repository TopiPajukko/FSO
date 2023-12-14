import { useState } from 'react'
import { allBooks } from '../queries'
import { useQuery } from '@apollo/client'

const Books = (props) => {
  const [filter, setFilter] = useState('all genres')

  const result = useQuery(allBooks)
  console.log(result)

  if (result.loading)  {
    return <div>loading books...</div>
  }

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  const genreDuplicateArray = books.map(b => b.genres).flat()

  const genres = [...new Set(genreDuplicateArray)]

  genres.push("all genres")

  const filteredBook = books.filter(book => filter === 'all genres'? book : book.genres.includes(filter))

  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBook.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((elm) => (
            <button onClick={() => setFilter(elm)}>{elm}</button>
          ))}
      </div>
    </div>
  )
}

export default Books
