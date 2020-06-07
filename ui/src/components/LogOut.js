import React from 'react'
import {useHistory} from 'react-router-dom'

export default function LogOut() {
  const history = useHistory()
  const logOut = (e) => {
    localStorage.clear()
    return history.push('/signup')
  }
  return (
    <>
      <button onClick={logOut} style={{position: "absolute", top: "50px", right: "50px"}}>Log Out</button>
    </>
  )
}
