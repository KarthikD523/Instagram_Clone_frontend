import React, { useState } from 'react'
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const [title,setTitle]=useState("")
  const [body,setBody]=useState("")
  const [image,setImage]=useState("")
  const [url,setUrl]=useState("")
  const navigate=useNavigate()
  const postDetails = () => {
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

          // Fetch to create post after getting the url
          fetch('/createPost', {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "authorization": "Bearer " + localStorage.getItem("jwt")
              },
              body: JSON.stringify({
                  title: title,
                  body: body,
                  pic: data.url // Use the updated url here
              })
          }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
                } else {
                    M.toast({ html: "Created Post Successfully", classes: "#00e676 green accent-3" });
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
            });
      })
      .catch(err => console.log(err));
};

  return (
    <div className='card input-field' style={{margin:"30px auto",textAlign:"center", maxWidth:"500px",padding:"20px"}}>
      <input  type='text' placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
      <input type='text' placeholder='body' value={body} onChange={(e)=>setBody(e.target.value)}/>
      <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={()=>postDetails()}
       >Submit Post
     </button>
    </div>
  )
}
