//action creator definitions
const GET_IMAGES = 'images/GET_IMAGES'

//action creator
const getImages = (images) => ({
  type: GET_IMAGES,
  payload: images
})

//thunks
//get all images
export const fetchImages = () => async (dispatch) => {
  const response = await fetch(`api/spots/:spotId`);

  if(response.ok) {
    const images = await response.json();
    dispatch(getImages(images));
  }
}

const initialState = { images: [], isLoading: true}

//reducer
const imageReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_IMAGES:
      return {...state, images: [...action.payload.Images]}
    default:
      return state;
  }
}

export default imageReducer;