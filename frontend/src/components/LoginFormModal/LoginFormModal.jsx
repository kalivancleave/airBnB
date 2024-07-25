import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState('');
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data) {
            setErrors("The provided credentials were invalid");
          }
        }
      )
  };

  //validations for the log in button paired with a useEffect to detect changes in the form
  const validate = () => {
    return credential.length >= 4 && password.length >= 6
  }

  const demoLogin = async () => {
    await dispatch(sessionActions.login({
      credential: "alphaabraham", 
      password: "alphaspassword"
    }))
      .then(closeModal)
  }

  return (
    <>
      <h1 className='leftAndRightMargin leftAndRightPadding'>Log In</h1>
      <form onSubmit={handleSubmit} className='leftAndRightMargin leftAndRightPadding'>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className='redText smallFont'>{errors}</p>
        <div className='displayFlex flexColumn'>
          <button type="submit" className={validate() ? 'activeButtonDesign mediumSize ' : 'inactiveButtonDesign mediumSize'}>Log In</button>
          <button type='submit' className="mediumFont noBorder redTextLink whiteBackground fullMargin" onClick={() => demoLogin()}>Log in as Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;