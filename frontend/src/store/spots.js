import { csrfFetch } from "./csrf";

//action creator definitions
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_IMAGE_DETAILS = 'spots/GET_SPOT_IMAGE_DETAILS';
const GET_SPOT_OWNER_DETAILS = 'spots/GET_SPOT_OWNER_DETAILS';
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS';
const DELETE_SPOT = 'spots/DELETE_SPOT'

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

const getUserSpots = (spots) => ({
  type: GET_USER_SPOTS,
  payload: spots
})

const destroySpot = (id) => {
  return {
    type: DELETE_SPOT,
    payload: id
  }
}


//thunks
//get all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`);

  if(response.ok) {
    const spots = await response.json();
    dispatch(getSpots(spots));
    return spots.Spots
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) return data.errors;
  } else {
    const data = await response.json();
    data.errors.puch(['A server error occurred.'])
    return data.errors;
  }
}

//get all spots owned by a logged in user
export const fetchUserSpots = () => async (dispatch) => {
  const response = await fetch(`api/spots/current`);

  if(response.ok) {
    const spots = await response.json();
    dispatch(getUserSpots(spots));
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

//create spot
export const createSpot = (spot) => async (dispatch) => {
  const {country, address, city, state, lat, lng, description, name, price} = spot
  const result = await csrfFetch('/api/spots', {
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
      price
    })
  });

  if(result.ok) {
    const data = await result.json();
    dispatch(fetchSpotDetails(data.id))
    return data.id
  } else if (result.status < 500) {
    const data = await result.json();
    if (data.errors) return data.errors;
  } else {
    const data = await result.json();
    data.errors.push(['A server error occurred.'])
    return data.errors;
  }
}

//update spot
export const updateSpot = (updatedSpot) => async (dispatch) => {
  const {id, country, address, city, state, lat, lng, description, name, price} = updatedSpot
  const result = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
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
      price
    })
  });

  if(result.ok) {
    const data = result.json();
    dispatch(fetchSpotDetails(data.id))
  } else if (result.status < 500) {
    const data = await result.json();
    if (data.errors) return data.errors;
  }
}

//delete spot
export const deleteSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    dispatch(destroySpot(id))
  } else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) return data.errors;
  }
}

const initialState = { spots: [], isLoading: true}

//reducer
const spotReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch(action.type) {
    case GET_SPOTS:
      return {...state, spots: [...action.payload.Spots]}
    case GET_USER_SPOTS:
      return {...state, spots: [...action.payload.Spots]}
    case GET_SPOT_IMAGE_DETAILS:
      return {...state, spotImageDetails: [...action.payload.SpotImages]}
    case GET_SPOT_OWNER_DETAILS:
      return {...state, spotOwnerDetails: action.payload.Owner}
    case DELETE_SPOT:
      delete newState[action.payload]
      delete newState.arr
      newState.arr = Object.values(newState)
      return newState
    default:
      return state;
  }
}

export default spotReducer;