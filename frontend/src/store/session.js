import { csrfFetch } from "./csrf";

//action creator definitions
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//action creator
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  }
}

const removeUser = () => {
  return {
    type: REMOVE_USER
  }
}


//////////////////////////////////////////////////////////
//thunks

//request session user from /api/session
export const login = (user) => async (dispatch) => {
  //destructure from user
  const {credential, password} = user;

  //create a response using a csrfFetch to the /spi/session
  const response = await csrfFetch('/api/session', {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });

  //create data in .json
  const data = await response.json();

  //dispatch the setUser action passing in the new user data
  dispatch(setUser(data.user));

  //return the response
  return response
}

//restore user
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//signup a user
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch('/api/users', {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response
}

//logout user
export const logout = (user) => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
}

/////////////////////////////////////////
//reducer
const sessionReducer = (state = {user: null}, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;