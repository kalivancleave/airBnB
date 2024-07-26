//action creator definitions
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_IMAGE_DETAILS = 'spots/GET_SPOT_IMAGE_DETAILS';
const GET_SPOT_OWNER_DETAILS = 'spots/GET_SPOT_OWNER_DETAILS';

//action creator
const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots
})

const getSpotImageDetails = (spotDetails) => ({
  type: GET_SPOT_IMAGE_DETAILS,
  payload: spotDetails
})

const getSpotOwnerDetails = (spotDetails) => ({
  type: GET_SPOT_OWNER_DETAILS,
  payload: spotDetails
});


//thunks
//get all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`);

  if(response.ok) {
    const spots = await response.json();
    dispatch(getSpots(spots));
  }
}

//get all details of a spot
export const fetchSpotDetails = (id) => async (dispatch) => {
  const response = await fetch(`api/spots/${id}`);

  if(response.ok) {
    const spotDetails = await response.json();
    dispatch(getSpotImageDetails(spotDetails));
  }
}

//get all spot images
export const fetchSpot = (id) => async (dispatch) => {
  const response = await fetch(`api/spots/${id}`);

  if(response.ok) {
    const spotImageDetails = await response.json();
    dispatch(getSpotImageDetails(spotImageDetails));
  }
}

//get spot owner info
export const fetchSpotOwner = (id) => async (dispatch) => {
  const response = await fetch(`api/spots/${id}`);

  if(response.ok) {
    const spotOwnerDetails = await response.json();
    dispatch(getSpotOwnerDetails(spotOwnerDetails));
  }
}

export const createSpot = (spot) => async (dispatch) => {
  const { country, address, city, state, lat, lng, description, name, price, SpotImages} = spot
  const result = await fetch('/api/spots', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      SpotImages //should be an array of objects??
    })
  });

  if(result.ok) {
    const data = await result.json();
    dispatch(fetchSpotDetails(data))
  }
}

const initialState = { spots: [], isLoading: true}

//reducer
const spotReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_SPOTS:
      return {...state, spots: [...action.payload.Spots]}
    case GET_SPOT_IMAGE_DETAILS:
      return {...state, spotImageDetails: [...action.payload.SpotImages]}
    case GET_SPOT_OWNER_DETAILS:
      return {...state, spotOwnerDetails: action.payload.Owner}
    default:
      return state;
  }
}

export default spotReducer;