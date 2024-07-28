import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import * as sessionActions from '../../store/session';
import './Navigation.css';

function ProfileButton({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); //keeps the click from bubbling up and triggeing close menu
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if(ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(() => navigate('/'));
  };

  const ulClassName = "alignLeft profileMenu" + (showMenu ? "" : "Hidden");

  return(
    <>
      <div className="displayFlex alignCenter">
        <NavLink to='/createSpot' className="noDecoration">
          <li className="redTextLink mediumFont sans leftAndRightPadding">Create a New Spot</li>
        </NavLink>
        <button onClick={toggleMenu} className="whiteBackground roundedCorners blackBorder blur profileButton">
          <FontAwesomeIcon icon={faBars} className="xlargeFont fullPadding blackText" />
          <FontAwesomeIcon icon={faCircleUser} className="xlargeFont fullPadding blackText" />
        </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        <div>
          <li className="noMargin noPadding mediumFont sans">Hello, {user.firstName}</li>
          <li className="noMargin topPadding mediumFont sans">{user.email}</li>
        </div>
        <div className="topMargin">
          <NavLink to='/ManageSpots' className="redTextLink mediumFont noDecoration">Manage Spots</NavLink>
        </div>
        <li className="littleTopMargin">
          <button onClick={logout} className="activeButtonDesign">Log Out</button>
        </li>
      </ul>
    </>
  )
}

export default ProfileButton