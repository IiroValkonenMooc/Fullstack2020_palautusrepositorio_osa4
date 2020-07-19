import axios from 'axios'
const baseUrl = '/api/login'

const login = async (username, password) => {
  try {
    const response = await axios.post(baseUrl, {
      username: username,
      password: password
    })

    return { err: null, login: response.data }
  } catch (e) {
    return { err: e.response, login: null }
  }
}

export default { login }