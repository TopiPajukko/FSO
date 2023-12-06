import { useParams } from 'react-router-dom'
import Blog from './Blog'

const SingleBlog = ({ blogs }) => {
  const id = useParams().id
  console.log('id', id)
  const singleBlog = blogs.find(n => n.id === String(id))

  if(!singleBlog){
    return null
  }

  return(
    <div>
      <Blog blog={singleBlog} />
    </div>
  )
}

export default SingleBlog