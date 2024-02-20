import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext,useRef,useEffect } from 'react';
import { UserContext } from '../App';
import M from 'materialize-css';

const Navbar=()=>{
  const [search,setSearch]=useState("")
  const [searchUserDetails,setSerachUserDetails]=useState([])
  const searchRef=useRef(null)
     const {state,dispatch}=useContext(UserContext)  
     const navigate=useNavigate() //Initially if user is not logged in ,state=null

     useEffect(()=>{
       M.Modal.init(searchRef.current)
     },[])


    const renderList=()=>{

     
      if(state){
         return [
         <li><i data-target="modal1" className="large material-icons modal-trigger">search</i></li> ,
          <li><Link to="/Profile">Profile</Link></li>,
          <li><Link to="/followingPosts">My Following Posts</Link></li>,
          <li><Link to="/Create">createPost</Link></li>,
          <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate('/SignIn')
          }}
          >Logout</button>
         ]
      }
      else{
        return  [
            <li><Link to="/SignIn">Login</Link></li>,
           <li><Link to="/SignUp">SignUp</Link></li>
          ]
      }
    }
    const fetchUsers=(query)=>{
      setSearch(query)
      fetch('/searchUser',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query:query,
        })
      }).then(
        res=>res.json()
      )
      .then(result=>{
        console.log(result)
        setSerachUserDetails(result.user)
      }
        )
      .catch(err=>console.log(err))
    }

    return(
        <nav>
    <div className="nav-wrapper white" style={{color:"black"}}>
      <Link to={state?"/":"/SignIn"} className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {
          renderList()
        }
        
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchRef} style={{color:"black"}}>
    <div className="modal-content" style={{color:"black"}}>
    <input type="text" placeholder='Search User' value={search} onChange={(e)=>fetchUsers(e.target.value)}/>
    <ul className="collection">
     { searchUserDetails && searchUserDetails.length >0 &&(
        searchUserDetails.map(item=>{
          console.log(item._id)
          return   <Link to={`/Profile/`+item._id} onClick={()=>{
            M.Modal.getInstance(searchRef).close()
          }}><li className="collection-item">{item.name}</li></Link>
        })
     )
      }
     
      
    </ul>
    </div>
    <div class="modal-footer">
    
    </div>
  </div>
  </nav>
    )
}

export default Navbar