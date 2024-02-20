import React, { useContext, useEffect, useState } from 'react'
import { json } from 'react-router-dom'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'


export default function Home() {
  const {state,dispatch}=useContext(UserContext)
  const [data,setData]=useState([])
   
  useEffect(()=>{
    fetch('/allPosts',
    {
     headers:{
      "authorization":"Bearer "+localStorage.getItem("jwt")
     }
    }
    ) .then(res=>res.json())
    .then(result=>{
      console.log(result)
      setData(result.posts)
    })
  },[])

  const likePost=(id)=>{
    fetch('/like',{
      method:"put",
      headers :{
        "Content-Type":"application/json",
         "authorization":"Bearer "+localStorage.getItem("jwt")
        
      },
      body:JSON.stringify({
         postId:id
      })
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
    })
  }

  const unlikePost=(id)=>{
    fetch('/like',{
      method:"PUT",
      headers :{
        'Content-Type':"application/json",
         'authorization':"Bearer "+localStorage.getItem("jwt")
        
      },
      body:JSON.stringify({
         postId:id
      })
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
    })
  }

  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
    })
    .then(res => {
        if (res.ok) {
            // Successful deletion with no content returned
            console.log("Post deleted successfully");
            // Optionally, update the UI or perform any necessary actions
        } else {
            // Handle error responses
            throw new Error(`Failed to delete post, status: ${res.status}`);
        }
    })
    .catch(err => {
        console.error("Error deleting post:", err);
        // Handle error here, display error message, etc.
    });
};



  const addComment=(text,id)=>{
    fetch('/comment',
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "authorization" : "Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId:id,
        text:text
      })

    },
   
    )
    .then(res=>res.json())
    .then(result=>{
      const newData=data.map(item=>{
        if(item._id==result._id){
         return result}
         else{
          return item
         }
      })
      setData(newData)
    })
    .catch(err=>console.log(err))
  }

  return (
    <div className='home'>
      {
        data.map(item=>{
         return <div  key={item._id} className='card home-card'>
          <li style={{listStyleType:"none"}}>
          <Link to={`/Profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>

            
          {item.postedBy._id===state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>}
            </li>
          <div className='card-image'>
              <img  src={item.photo}/>
          </div>
          <div className='card-content'>
          <i className="material-icons" style={{color:"red"}}>favorite</i>
          <i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>
          <i className="material-icons" onClick={()=>unlikePost(item._id)} >thumb_down</i>
          <h6>{item.likes.length} likes</h6>
             <h6>{item.title}</h6>
             <p>{item.body}</p>
             {
              item.comments.map(record=>{
              return  <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}:</span>{record.text}</h6>
              })
             }
             <form onSubmit={(e)=>{
              e.preventDefault()
              addComment(e.target[0].value,item._id)
             }}>
             <input  type='text' placeholder='Add a comment' />
             
             </form>
            
          </div>
      </div>
        })
      
      }
    </div>
  )
}
