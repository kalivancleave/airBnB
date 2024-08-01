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
      <div className="displayFlex spaceBetween alignTop noMargin noPadding navBar darkGreyBottomBorder">
        <li className="noMargin noPadding">
          <NavLink to='/' className="noMargin noPadding">
            <a href=''>
              <img src={AirbnbHomeLogo} className='logo  noMargin' alt="home" />
            </a>
          </NavLink>
        </li>
        <li className="topMargin">
          {isLoaded && sessionLinks}
        </li>
      </div>
    </>
  )
}

export default Navigation;