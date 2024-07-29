import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'

//action creator
const getReviews = (reviews) => ({
  type: GET_REVIEWS,
  payload: reviews
})

const getSpotReviews = (spotReviews) => ({
  type: GET_SPOT_REVIEWS,
  payload: spotReviews
})

const destroyReview = (id) => ({
  type: DELETE_REVIEW,
  payload: id
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

export const createReview = (reviewDetails) => async (dispatch) => {
  const {review, stars, spotId} = reviewDetails
  const result = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      review,
      stars
    })
  })

  if(result.ok) {
    const data = await result.json();
    dispatch(fetchReviewsForSpot(data.id))
  } else if (result.status < 500) {
    const data = await result.json();
    if (data.errors) return data.errors;
  } else {
    const data = await result.json();
    data.errors.puch(['A server error occurred.'])
    return data.errors;
  }
}

//delete review
export const deleteReview = (id) => async (dispatch) => {
  const res = await csrfFetch(`api/reviews/${id}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    dispatch(destroyReview(id))
  } else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) return data.errors;
  }
}

const initialState = {reviews: [], isLoading: true}

//reducer
const reviewReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch(action.type) {
    case GET_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    case GET_SPOT_REVIEWS:
      return {...state, reviews: [...action.payload.Reviews]}
    case DELETE_REVIEW:
      delete newState[action.payload]
      delete newState.arr
      newState.arr = Object.values(newState)
      return newState
    default:
      return state;
  }
}

export default reviewReducer;