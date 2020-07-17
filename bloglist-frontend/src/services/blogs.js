import axios from 'axios'
const baseUrl = '/api/blogs'

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const submitBlog = async (token, title, author, url, setBlogs) => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.post(baseUrl,
      {
        title: title,
        author: author,
        url: url,
      }, config
    )

    return { err: null, response: response}
  } catch (e) {
    return { err: e, response: null}
  }
}

const likeBlog = async (token, blog) => {
  const config = {
    headers: { Authorization: token },
  }

  let modifiedBlog = blog
  modifiedBlog.likes += 2

  try {
    const response = await axios.put(baseUrl+'/'+blog.id, modifiedBlog, config)

    return { err: null, response: response}
  } catch (e) {
    console.log('e :>> ', e);
    return { err: e, response: null}
  }

}

export default { getAll, submitBlog, likeBlog }