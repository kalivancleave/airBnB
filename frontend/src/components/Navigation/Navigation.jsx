import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';


function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user)

  const sessionLinks = sessionUser ? 
    (
      <>
        <li className="navLink">
          <ProfileButton user={sessionUser} />
        </li>
      </>
    ) 

    :

    (
      <>
        <li>
          <NavLink to='/login' className="navLink">Log In</NavLink>
        </li>
        <li> 
          <NavLink to='/signup' className="navLink">Sign Up</NavLink>
        </li>
      </>
    );

  return(
    <>
      <ul className="navBar">
        <li>
          <NavLink to='/' className="navLink">Home</NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </>
  )
}

export default Navigation;