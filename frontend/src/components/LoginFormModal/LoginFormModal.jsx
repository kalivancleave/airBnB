import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          let errorMessage = JSON.stringify(Object.values(data));
          if (data) {
            setErrors(errorMessage.slice(2, errorMessage.length));
          }
        }
      );
  };

  //validations for the log in button paired with a useEffect to detect changes in the form
  const validate = () => {
    return credential.length >= 4 && password.length >= 6
  }

  return (
    <>
      <h1 className='leftAndRightMargin'>Log In</h1>
      <form onSubmit={handleSubmit} className='leftAndRightMargin'>
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
        <p className='redText smallFont'>{JSON.stringify(errors).slice(1, errors.length - 1)}</p>
        <button type="submit" 
        className={validate() ? 'activeButtonDesign' : 'inactiveButtonDesign'} //disabled button with style
        //disabled={!validate()} //basic way of disabling a button
        >Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;