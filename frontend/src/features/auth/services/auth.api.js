import axios from "axios"

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '')

const api = axios.create({
    baseURL: `${apiBaseUrl}/auth`,
    withCredentials: true,
})

export async function register({username, email, password}){
    const response = await api.post('/register', {
        username,
        email,
        password
    })
    return response.data
}

export async function login({email, password}){
    const response = await api.post('/login',
        { email, password }
    )
    return response.data
}


export async function logout(){
    const response = await api.post('/logout')
    return response.data
}

export async function getMe(){
    const response = await api.get('/get-me')
    return response.data
}