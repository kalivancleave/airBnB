import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { fetchSpot } from "../../store/spots";
import { fetchSpotOwner } from '../../store/spots'
import { cloudinaryPreviewImage } from "../../App";


const SingleSpot = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const singleSpot = useSelector(state => state.spots.spots.find(spots => spots.id === Number(id)))
  const spotImageDetails = useSelector(state => state.spots.spotImageDetails);
  const spotOwnerDetails = useSelector(state => state.spots.spotOwnerDetails);
  
  useEffect(() => {
    dispatch(fetchSpots());
    dispatch(fetchSpot(id));
    dispatch(fetchSpotOwner(id));
  }, [dispatch, id])
  
  return (
    <>
      <div>
        <h1>Single Spot</h1>
        <h2>{singleSpot?.name}</h2>
        <h2>{singleSpot?.city}, {singleSpot?.state}, {singleSpot?.country}</h2>
      </div>
      <ol>
        {spotImageDetails?.map(({id, url}) => (
          <div key={id}>
            <li className="smallSize">{cloudinaryPreviewImage(url)}</li>
          </div>
        ))}
      </ol>
      <div>
        <h2>Hosted by {spotOwnerDetails?.firstName} {spotOwnerDetails?.lastName}</h2>
        {console.log(spotOwnerDetails)}
        <textarea>Lorem ipsum about the space</textarea>
      </div>
      <div>
        <h2>${singleSpot?.price} night</h2>
        <h2>{singleSpot?.avgRating}</h2>
        <h2>number of reviews</h2>
        <button>Reserve</button>
      </div>
      <div>
        <h2>page separator -----------------------------------------</h2>
      </div>
      <div>
        <h2>{singleSpot?.avgRating}</h2>
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