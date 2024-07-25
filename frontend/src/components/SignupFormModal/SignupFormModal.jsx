import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const {closeModal} = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors)
          }
        });
    }
    return setErrors ({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const validate = () => {
    return  email.length === 0 || 
            username.length < 4 || 
            firstName.length === 0 || 
            lastName.length === 0 ||
            password.length < 6 ||
            confirmPassword.length < 6
  }

  return (
    <>
      <h1 className="leftAndRightMargin leftAndRightPadding">Sign Up</h1>
      <form onSubmit={handleSubmit} className="leftAndRightMargin leftAndRightPadding">
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="redText mediumFont whiteBackground fullMargin">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="redText mediumFont whiteBackground fullMargin">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="redText mediumFont whiteBackground fullMargin">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="redText mediumFont whiteBackground fullMargin">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="redText mediumFont whiteBackground fullMargin">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="redText mediumFont whiteBackground fullMargin">{errors.confirmPassword}</p>}
        <button type="submit" className={!validate() ? "activeButtonDesign mediumSize" : "inactiveButtonDesign mediumSize"}>Sign Up</button>
      </form>
    </>
  )
}

export default SignupFormModal;

