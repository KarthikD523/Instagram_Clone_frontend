import React, { createContext, useContext, useEffect, useReducer } from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate, } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SignUp from './Components/screens/SignUp';
import Signin from './Components/screens/Login';
import Profile from './Components/screens/Profile';
import Home from './Components/screens/Home';
import CreatePost from './Components/screens/createPost';
import UserProfile from './Components/screens/UserProfile';
import {reducer,initState} from './reducers/userReducer'
import FollowingPosts from './Components/screens/FollowingPosts';



export const UserContext=createContext()

const Routing=()=>{
   const navigate=useNavigate()
   const {dispatch}=useContext(UserContext)
  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("user"))
     if(user){
      dispatch({type:"USER",payload:user})
      console.log(user)
     
     }
     else{
      navigate('/SignIn')
     }
  },[])
 return <>

     <Routes>
        <Route path='/' element={<Home />} />
        <Route exact path='/Profile' element={<Profile />} />
        <Route path='/SignIn' element={<Signin />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Create' element={<CreatePost/>} />
        <Route path='/Profile/:userId' element={<UserProfile/>} />
        <Route path='/followingPosts' element={<FollowingPosts/>} />

        

      </Routes>
 </>
}

function App() {
  const [state,dispatch]=useReducer(reducer,initState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
            <Navbar />
            <Routing />
        </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
