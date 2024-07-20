import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { IoPersonCircleSharp } from "react-icons/io5";
import * as sessionActions from '../../store/session';
import './Navigation.css';

function ProfileButton({user}) {
  const dispatch = useDispatch();
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
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profileMenu" + (showMenu ? "" : "Hidden");

  return(
    <>
      <button onClick={toggleMenu} className="profileButton">
        <IoPersonCircleSharp />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  )
}

export default ProfileButton