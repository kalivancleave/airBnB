import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";

const SingleSpot = () => {
   const { id } = useParams();
  const dispatch = useDispatch();
  const singleSpot = useSelector(state => state.spots.spots.find(spots => spots.id === Number(id)))
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])
  
  return (
    <>
      <div>
        <h1>Single Spot</h1>
        <h2>{singleSpot.name}</h2>
        <h2>{singleSpot.city}, {singleSpot.state}, {singleSpot.country}</h2>
      </div>
      <div>
        <h2>IMAGES PLACEHOLDER: I think this requires cloudinary {singleSpot.previewImage}</h2>
      </div>
      <div>
        <h2>Hosted by first name last name bring in the owner id info</h2>
        <textarea>Lorem ipsum about the space</textarea>
      </div>
      <div>
        <h2>${singleSpot.price} night</h2>
        <h2>{singleSpot.avgRating}</h2>
        <h2>number of reviews</h2>
        <button>Reserve</button>
      </div>
      <div>
        <h2>page separator -----------------------------------------</h2>
      </div>
      <div>
        <h2>{singleSpot.avgRating}</h2>
        <h2>number of reviews</h2>
        <h1> REVIEWS PLACEHOLDER </h1>
        {/* <ol>
          {reviews.map(({id, firstname, month, year, review}) => (
            <div key={id}>
              <li>{firstname}</li>
              <li>{month} {year}</li>
              <li>{review}</li>
            </div>
          ))}
        </ol> */}
      </div>
    </>
  ) 
}

export default SingleSpot