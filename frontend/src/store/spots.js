//action creator definitions
const GET_SPOTS = 'spots/GET_SPOTS';

//action creator
const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots
})

//thunks
//get all spots
export const allSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`);

  if(response.ok) {
    const listOfSpots = await response.json();
    dispatch(getSpots(listOfSpots));
  }
}

//reducer
const spotReducer = (state = {spots: null}, action) => {
  switch(action.type) {
    case GET_SPOTS:
      return {...state, spots: action.payload}
    default:
      return state;
  }
}

export default spotReducer;