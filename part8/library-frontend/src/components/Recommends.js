import { useQuery } from "@apollo/client"
import { allBooks, USER } from "../queries"
import { getBooksByGenre } from "../queries"

const Recommends = (props) => {

  const result = useQuery(allBooks)
  

  const userResult = useQuery(USER)
  console.log('User Data:', userResult.data);

  const user = userResult.data ? userResult.data.me : null;

  const genres = user ? user.favoriteGenre : null;

  const booksResult = useQuery(getBooksByGenre, {variables: {genres}})
  console.log('Books Data:', booksResult.data);

  const books = booksResult.data ? booksResult.data.books || [] : [];


    if (result.loading || userResult.loading) {
      return <p>Loading books...</p>
    }

    if (userResult.error || booksResult.error) {
      return <p>Error fetching data</p>;
    }

    if (!props.show) {
      return null
    }

    return (
        <div>
          <h2>Recommendations</h2>
          <p>books in your favorite genres {genres} </p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {books.map((book) => (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
               ))}
            </tbody>
      </table>
        </div> 
    )
}

export default Recommends