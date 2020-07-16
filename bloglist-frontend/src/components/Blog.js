import React, {useState} from 'react'

const Blog = ({ blog }) => {
  const [viewAll, setViewAll] = useState(false)

  const changeShow = () => {
    setViewAll(!viewAll)
  }

  console.log('blog :>> ', blog);

  if(!viewAll){
    return (
      <div className='Blog-styling'>
        {blog.title} {blog.author}
        <button className='Blog-info-button' onClick={changeShow}>
          view all
        </button>
      </div>
    )
  } else {
    return(
      null
    )
  }
  
  
}

export default Blog
