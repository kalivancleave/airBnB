import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  //validations for the log in button paired with a useEffect to detect changes in the form
  const validate = () => {
    return credential.length >= 4 && password.length >= 6
  }

  useEffect(() => {
    const isValid = validate();
    setIsValid(isValid);
  }, [credential, password])

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
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" 
        className={validate() ? 'activeButtonDesign' : 'inactiveButtonDesign'} //disabled button with style
        //disabled={!validate()} //basic way of disabling a button
        >Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;