import React from 'react'
import { logout } from "../../../slices/auth"
import { useDispatch, useSelector} from 'react-redux';
import profile from "../../../assets/images/profile.png"
import { Link } from 'react-router-dom';





const NavBar = () => {
 

  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const loginId = user.loginId
  const username = user.clientContactPersonName

  // const [isHover, setIsHover] = useState(false);

  // const handleMouseEnter = () => {
  //    setIsHover(true);
  // };
  // const handleMouseLeave = () => {
  //    setIsHover(false);
  // };

  // const boxStyle = {
  //   backgroundColor: isHover ? 'lightblue' : 'rgb(0, 191, 255)' 
  // };

  const exitback = () => {
    dispatch(logout());
  }
  return (
    <div>
        
 <nav class="navbar navbar-light" style={{backgroundColor:"#111D4A"}}>
    
  <span class="navbar-brand mb-0 h1"><img src={profile}  alt="profile" title="profile"/><h4 className='text-white float-right'><b>{username}</b>, Welcome back</h4>
  <div class="mr-0"style={{fontSize:"15px"}}>
  <span class="text-white text-sm" style={{paddingLeft: '40px'}}>Login Id: &nbsp; {loginId}</span>
  </div>
  </span>
 
 <div class="mr-5">
{/* Dropdown in the Nav Bar */}
 <div class="dropdown">
 <button type="button" class="btn btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  <i class="fa fa-cog fa-2xl" aria-hidden="true" style={{fontSize:"24px",color:"white"}}></i>
 <span class="glyphicon glyphicon-cog text-white" style={{color:"white"}}></span>
                <span class="caret"></span></button>
                <div class="dropdown-menu mr-5" style={{backgroundColor:"#1D265E", height:"5rem", width:"10rem"}}>
                <div class="row px-md-4 p-2">
                 <Link to = "/dashboard/profile" class="dropdown-item text-warning">My Profile</Link>
                 <Link onClick={exitback} class="dropdown-item text-warning ">Log out</Link>

                 </div>
                 
</div>
</div>
</div>
{/* Dropdown in the Nav Bar */}

 

                    
</nav>
    </div>
  )
}

export default NavBar