import React, {useState, useEffect} from 'react'
import {useHistory } from 'react-router-dom'
import uuid from 'react-uuid'
import axios from 'axios'
import LogOut from './LogOut';

function Todos() {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState({_id: '', title: ''})
  const [save, setSave] = useState(false)

  let url 
  useEffect(() => {
    try {
      if (process.env.NODE.ENV === 'production') {
        url = 'http://localhost:4000'
      }
    } catch {
      url = ''
      console.log(url)
    }
  }, [])

  const getTodos = () => {
    if(localStorage.getItem('accessToken') != null) { 
      console.log('req todos')
      axios.get('/todos', {
        headers: {
          'Content-Type': 'application/json',
          "authorization": "Bearer " + localStorage.getItem('accessToken')
        }
      })
      .then(res => {
        setUsername(res.data.username)
        setTodos(res.data.todos)
      })
      .then(res => setSave(true))
      .catch(err => (err.response) ? console.log(err) : alert(err))
    } else {
      return history.push('/signup') 
    }
  } 

  useEffect(() => {
    getTodos()
  }, [])

  const addTodo = (e) => {
    e.preventDefault()
    // count++
    // setTodoInput({title: '1'})
    setTodos([{
      id: uuid(),
      title: todoInput.title,
      description: 'description'
    }, ...todos])
  }


  useEffect(() => {
    if (save) {
      axios.put('http://localhost:4000/todos/update', {
        headers: {
          'Content-Type': 'application/json',
          "authorization": "Bearer " + localStorage.getItem('accessToken')
        },
        allTodos: todos
        // allTodos: ['1', '2', '3']
      })
      .then(res => {
        if(res.status === 201) {
          console.log('saved')
        } else {
          console.log('not saved')
        }
      })
      .catch(err => err.response ? alert(err.response.data.msg) : alert('err'))
    }

  }, [todos])

  const deleteTodo = (e) => {
    let newTodos = todos.filter(v => v.id !== e.target.id)
    setTodos(newTodos)

    // axios.delete(`http://localhost:4000/todos/delete/${e.target.id}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     "authorization": "Bearer " + localStorage.getItem('accessToken')
    //   },
    // })
    // .then(res => {
    //   if(res.status === 200) {
    //     console.log('deleted successfully')
    //   }
    // })
    // .catch(err => (err.response) ? alert(err.response.data.msg) : console.log(err))
  }
  
  return (
    <>
      <h1>Todo app</h1>
      <h2>Hi {username}</h2>
      <form>
        <input type="text" value={todoInput.title} onChange={e => setTodoInput({title: e.target.value})} />
        <button type="submit" onClick={addTodo}>Add</button>
      </form>
      <ul>
  { (todos == 0) ? <li>You have no todos</li> : todos.map((v, i) => <li key={v.id || i}>{i}: {v.title} <button id={v.id} onClick={deleteTodo} >Delete</button> </li> )}
      </ul>
      <LogOut />
    </>
  )
}

export default Todos
