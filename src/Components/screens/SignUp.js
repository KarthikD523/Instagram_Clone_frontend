import React, { useEffect } from 'react'
import { Link, json,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'


export default function SignUp() {
  const [name,setName]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const navigate=useNavigate()
  const [image,setImage]=useState("")
  const [url,setUrl]=useState(undefined)

useEffect(()=>{
    if(url){
      uploadFields()
    }
},[url])

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta_clone");
    data.append('cloud_name', 'den8dfm4y');

    fetch('https://api.cloudinary.com/v1_1/den8dfm4y/image/upload', {
        method: "POST",
        body: data
    }).then(res => res.json())
      .then(data => {
          setUrl(data.url); // Update url state
          console.log(data.url); // Log the updated url

          
      })
      .catch(err => console.log(err));
};

const uploadFields=()=>{
  fetch('/signUp',{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      name: name,
      email:email,
      password:password,
      pic:url
    })

    
  }).then(res=>res.json())
  .then(data=>{
    if(data.error){
      M.toast({html: data.error,classes:"#d32f2f red darken-2"})
    }
    else{
      M.toast({html: data.message,classes:"#00e676 green accent-3"})
      navigate('/SignIn')
    }
  }).catch(err=>{
    console.log(err)
  })
}

  const PostData=()=>{
    if(image){
      uploadPic()
    }
    else{
      uploadFields()
    }
    
  }
  return (
    <div className='myCard'>
        <div className="card-auth input-field ">
          <h2>Instagram</h2>
          <input type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
       <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
       
       <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
       <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>

       <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={()=>PostData()}
       >SignUp
     </button>
     <h5> <Link to='/SignIn'>Already have an Account?</Link></h5>
    
    

      </div>

      
    </div>
  )
}
