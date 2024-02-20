import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [image,setImage]=useState("")
  const [url,setUrl]=useState(undefined)
  const { state, dispatch } = useContext(UserContext);
  const [myPics, setMyPics] = useState([]);

  useEffect(() => {
    // Check if state exists and has name property
    if (state && state.name) {
      console.log(state.name);
      fetch('/myPosts', {
        headers: {
          "authorization": "Bearer " + localStorage.getItem("jwt")
        }
      })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setMyPics(result.post);
        console.log(myPics);
      });
    }
  }, [state]); // Add state as dependency to useEffect

  useEffect(()=>{
        if(image){
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
          localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))    //Changing the local storage
          dispatch({type:"UPDATEPIC",payload:data.url})   ////changing the context of USER
        
          fetch('/updatePic',{
            method:"PUT",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
              pic:data.url
            })
          }).then(res=>res.json())
          .then(result=>console.log(result))
           .catch(err=>console.log(err))

      })
      .catch(err => console.log(err));
        }
  },[image])

  const updatePic = (file) => {
    setImage(file)
    
};




  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      {state && state.name && (
        <div style={{ display: "flex", margin: "18px 0px", justifyContent: "space-around", borderBottom: "1px solid grey" }}>
          <div className='Profile-pic'>
            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state?state.pic:""} />
          </div>
          
          <div>
            <h5>{state.name}</h5>
            <div style={{ display: "flex", justifyContent: "space-around", width: "108%", margin: "30px 0px" }}>
              <h6>{myPics.length} posts</h6>
              <h6>{ state.followers.length} followers</h6>
              <h6>{ state.following.length} following</h6>
              
            </div>
            <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Update Image</span>
        <input type="file" onChange={(e)=>updatePic(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
          </div>
          
        
        </div>
        
        
      )}
      
      
      <div className='gallery'>
        {
          myPics.map(item => {
            return <img className='item' src={item.photo} alt={item.title} key={item._id} />
          })
        }
      </div>
    </div>
  )
}
