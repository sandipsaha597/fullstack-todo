import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'

export default function SignUp() {
  const history = useHistory()
  const [username, setUsername] = useState('Sam')
  const [password, setPassword] = useState('hey')

  const signup = (e) => {
    e.preventDefault()
    axios.post('http://localhost:4000/signup', 
    {
      username: username,
      password: password 
    })
    .then(res => alert(res.data))
    .catch(err => alert(err))
  }
  
  const login = (e) => {
    e.preventDefault()
    console.log('click');
    axios.post('http://localhost:4000/login', 
    {
      username: username,
      password: password
    })
    .then(res => {
      if(res.data.msg === 'success') {
        console.log(res)
        localStorage.setItem("accessToken", res.data.accessToken)
        return history.push('/')
      } else {
        alert(res.data.msg)
      }
    } )
    .catch(err => alert(err))
  }


  return (
    <>
      <h1>Log in system</h1>
      <h2>Sign up</h2>
      <form>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} /> <br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br/>
        <button type="submit" onClick={signup}>Sign up</button>
      </form>
      <h2>Log in</h2>
      <form>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} /> <br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br/>
        <button type="submit" onClick={login}>Log in</button>
      </form>
    </>
  )
}
