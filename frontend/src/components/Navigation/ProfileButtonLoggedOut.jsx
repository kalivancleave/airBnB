import {useState, useEffect, useRef} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"
import { faBars } from '@fortawesome/free-solid-svg-icons';

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";



function ProfileButtonLoggedOut() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if(!showMenu) return;

    const closeMenu = (e) => {
      if(ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const ulClassName = "profileMenu" + (showMenu ? "" : "Hidden");

  return(
    <>
      <button onClick={toggleMenu} className="whiteBackground roundedCorners blackBorder blur">
        <FontAwesomeIcon icon={faBars} className="xlargeFont fullPadding blackText" />
        <FontAwesomeIcon icon={faCircleUser} className="xlargeFont fullPadding blackText" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <div className="">
          <li className="fullMargin">
            <OpenModalButton
              buttonText="Log In"
              modalComponenet={<LoginFormModal />}
              />
          </li>
          <li className="fullMargin"> 
            <OpenModalButton
              buttonText="Sign Up"
              modalComponenet={<SignupFormModal />}
              />
          </li>
        </div>
      </ul>
    </>
  )
}

export default ProfileButtonLoggedOut