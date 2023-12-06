/* eslint-disable indent */
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../request'
import { useUserDispatch } from '../userContext'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UsersInfo = () => {

  const result = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    options:
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  })
  console.log('1111', result)

  useUserDispatch({ type: 'setAllUsers', payload: result.data })

  if( result.isLoading ){
    return <div>loading data...</div>
  }

  if( result.isError ){
    return<div>blog service not available due to problem in server</div>
  }

  const users = result.data

  console.log('display', users)

  return (
    <div id="content">
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <td>User</td>
            <td>Blogs created</td>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td>
              <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default UsersInfo