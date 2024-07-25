import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  const ulClassName = "profileMenu" + (showMenu ? "" : "Hidden");

  return(
    <>
      <div className="displayFlex">
        <li>Create a New Spot</li>
        <button onClick={toggleMenu} className="whiteBackground roundedCorners blackBorder blur">
          <FontAwesomeIcon icon={faBars} className="xlargeFont fullPadding blackText" />
          <FontAwesomeIcon icon={faCircleUser} className="xlargeFont fullPadding blackText" />
        </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li>email: {user.email}</li>
        <li>
          <button onClick={logout} className="activeButtonDesign">Log Out</button>
        </li>
      </ul>
    </>
  )
}

export default ProfileButton