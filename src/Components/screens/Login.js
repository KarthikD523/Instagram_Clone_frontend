import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

import { UserContext } from '../../App'

export default function Login() {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const PostData = () => {
    fetch('https://instagram-clone-backend-k8nz.vercel.app/signIn', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" })
        }
        else {
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          dispatch({ type: "USER", payload: data.user })
          M.toast({ html: "Signed In Successfully", classes: "#00e676 green accent-3" })
          navigate('/')
        }
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='myCard'>
      <div className="card-auth input-field ">
        <h2>Instagram</h2>
        <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={PostData}>
          Sign In
        </button>
        <h5> <Link to='/SignUp'>Don't have an Account?</Link></h5>
      </div>
    </div>
  )
}
