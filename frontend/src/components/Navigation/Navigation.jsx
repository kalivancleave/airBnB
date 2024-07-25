import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AirbnbHomeLogo from "../../assets/AirbnbHomeLogo.png"
import ProfileButton from "./ProfileButton";
import ProfileButtonLoggedOut from "./ProfileButtonLoggedOut";
import './Navigation.css';


function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user)

  const sessionLinks = sessionUser ? 
    (
      <li className="navLink">
        <ProfileButton user={sessionUser} />
      </li>
    ) 

    :

    (
      <li className="navLink">
        <ProfileButtonLoggedOut />
      </li>
    );

  return(
    <>
      <ul className="navBar">
        <li>
          <NavLink to='/' className="navLink">
            <a href=''>
              <img src={AirbnbHomeLogo} className='logo noPadding noMargin' alt="home" />
            </a>
          </NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </>
  )
}

export default Navigation;