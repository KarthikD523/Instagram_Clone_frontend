import React, { useEffect, useState ,useContext} from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'



export default function UserProfile() {
 
    const {userId}=useParams()
    
    console.log(userId)
  const {state,dispatch}=useContext(UserContext)
  const [myPics,setmyPics]=useState([])
  const [userProfile,setUserProfile]=useState(null)
  
  const [showFollow, setshowFollow] = useState(state && state.following && !state.following.includes(userId) ? true : false);


  useEffect(()=>{
    console.log()
      fetch(`/user/${userId}`,
      {
      headers:{
        "authorization" : "Bearer "+localStorage.getItem("jwt")
      },
      
    }
    )
      .then(res=>res.json())
      .then(result=>{
        console.log(result)
        setmyPics(result.post)
        setUserProfile(result)
        console.log(userProfile)
        console.log(myPics)
      })
  },[])

const followUser=()=>{
  fetch('/follow',
  
  {
    method:"PUT",
    headers:{
      "authorization":  "Bearer "+localStorage.getItem("jwt"),
      "Content-Type":  "application/json",
    },
    body:JSON.stringify({
      followId:userId,
    })
  }
  )
  .then(res=>res.json())
  .then(data=>{
    dispatch({type:"UPDATE",payload:{following:data.currentUser.following,
    followers:data.currentUser.followers
    }})
    localStorage.setItem("user",JSON.stringify(data.currentUser))
    console.log(data)
    setUserProfile((prev)=>{
          return {
            ...prev,
            user:{
              ...prev.user,
              followers:[...prev.user.followers,data.currentUser._id]
            }
          }
    })
    setshowFollow(false)
  })
}

const unfollowUser=()=>{
  fetch('/unfollow',
  
  {
    method:"PUT",
    headers:{
      "authorization":  "Bearer "+localStorage.getItem("jwt"),
      "Content-Type":  "application/json",
    },
    body:JSON.stringify({
      unfollowId:userId,
    })
  }
  )
  .then(res=>res.json())
  .then(data=>{
    dispatch({type:"UPDATE",payload:{following:data.currentUser.following,
    followers:data.currentUser.followers
    }})
    localStorage.setItem("user",JSON.stringify(data.currentUser))
    console.log(data)
    setUserProfile((prev)=>{
      const updatedFollower=prev.user.followers.filter(item=>item!=data.currentUser._id)
      console.log(updatedFollower)
          return {
            ...prev,
             user: {
              ...prev.user,
              followers:updatedFollower,
            }
           
           
          }
    })
    setshowFollow(true)
  })
}


  return (
      <div style={{maxWidth:"550px",margin:"0px auto"}}>
        {userProfile ?
        
      <div style={{display:"flex",margin:"18px 0px",justifyContent:"space-around",borderBottom:"1px solid grey"}}>
        <div className='UserProfile-pic'>
          <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
          src={userProfile?userProfile.user.pic:""}/>
        </div>

        <div>
          <h5>{userProfile?userProfile.user.name:""}</h5>
          <div style={{display:"flex",justifyContent:"space-around",width:"108%",margin:"30px 0px"}}>
            <h6>{userProfile?userProfile.posts.length:""} posts</h6>
            <h6>{userProfile?userProfile.user.followers.length:""} followers</h6>
            <h6>{userProfile?userProfile.user.following.length:""} following</h6>
            
          </div>
          {
            showFollow ? 

            <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={()=>followUser()}
            >Follow
          </button>
          :
          <button className="btn waves-effect waves-light #1976d2 blue darken-2" onClick={()=>unfollowUser()}
          >Unfollow
        </button>
          }


         
     
        </div>
      </div> : <h2>Loading..</h2>}
      
    {userProfile && userProfile.posts &&
      <div className='gallery'>
        {
          userProfile.posts.map(item=>{
           return <img className='item' src={item.photo} alt={item.title} key={item._id} />
          })
        }
     </div>
}

    </div> 
    

  )
}
