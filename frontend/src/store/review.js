const GET_REVIEWS = 'reviews/GET_REVIEWS';
const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';

//action creator
const getReviews = (reviews) => ({
  type: GET_REVIEWS,
  payload: reviews
})

const getSpotReviews = (spotReviews) => ({
  type: GET_SPOT_REVIEWS,
  payload: spotReviews
})





//thunks
export const fetchReviews = () => async (dispatch) => {
  const response = await fetch(`api/reviews`);

  if(response.ok) {
    const reviews = await response.json();
    dispatch(getReviews(reviews));
  }
}

export const fetchReviewsForSpot = (id) => async (dispatch) => {
  const response = await fetch(`api/spots/${id}/reviews`);

  if(response.ok) {
    const spotReviews = await response.json();
    dispatch(getSpotReviews(spotReviews));
  }
}

const initialState = {reviews: [], isLoading: true}

//reducer
const reviewReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    case GET_SPOT_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    default:
      return state;
  }
}

export default reviewReducer;