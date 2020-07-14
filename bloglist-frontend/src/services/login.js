import axios from 'axios'
const baseUrl = '/api/login'

const login = async (username, password) => {
   try {
        const request = await axios.post(baseUrl, {
            username: username,
            password: password
        })

        return {err: null, login: request.data}
    } catch (e) {
        return {err: e, login: null}
    }
}

export default { login }