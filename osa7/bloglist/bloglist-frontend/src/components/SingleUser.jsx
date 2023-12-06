import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../request'

const SingleUser = () => {
  const id = useParams().id
  console.log('id', id)
  const result = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    options:
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  })

  if( result.isLoading ){
    return <div>loading data...</div>
  }

  if( result.isError ){
    return<div>blog service not available due to problem in server</div>
  }

  const allUsers = result.data
  const user = allUsers.find(n => n.id === String(id))

  if(!user){
    return null
  }

  console.log('individual user', user)

  return(
    <div>
      <h2>{user.username}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id} >{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default SingleUser