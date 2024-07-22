//action creator definitions
const GET_SPOTS = 'spots/GET_SPOTS';

//action creator
const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots
})

//thunks
//get all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`);

  if(response.ok) {
    const spots = await response.json();
    dispatch(getSpots(spots));
  }
}

const initialState = { spots: [], isLoading: true}

//reducer
const spotReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_SPOTS:
      return {...state, spots: [...action.payload.Spots]}
    default:
      return state;
  }
}

export default spotReducer;