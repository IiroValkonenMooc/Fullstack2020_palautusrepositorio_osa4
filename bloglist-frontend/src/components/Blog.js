import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [viewAll, setViewAll] = useState(false)

  const changeShow = () => {
    setViewAll(!viewAll)
  }

  const handleLikeClick = () => {
    likeBlog(blog)
  }

  const handleDeleteClick = () => {
    deleteBlog(blog)
  }

  //console.log('blog :>> ', blog)

  if(!viewAll){
    return (
      <div className='Blog-styling'>
        {`${blog.title}, ${blog.author}`}
        <button className='Blog-info-button' onClick={changeShow}>
          view all
        </button>
      </div>
    )
  } else {
    return(
      <div className='Blog-expanded-styling'>
        <div>
          <div>
            {`Title: ${blog.title}, Author: ${blog.author}`}
          </div>
          <div>
            {`Url: ${blog.url}`}
          </div>
          <div>
            {`Likes: ${blog.likes}`}
            <button  className='Blog-like-button' onClick={handleLikeClick}>
              like
            </button>
          </div>
          <div>
            {`Added by: ${blog.user.username}`}
          </div>
        </div>
        <button className='Blog-info-button' onClick={changeShow}>
          hide <br></br> expanded <br></br> info
        </button>
        <button className='Blog-delete-button' onClick={handleDeleteClick}>
          delete
        </button>
      </div>
    )
  }
}

export default Blog
