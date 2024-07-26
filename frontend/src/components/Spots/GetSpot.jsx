import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { fetchSpot } from "../../store/spots";
import { fetchSpotOwner } from '../../store/spots'
import { cloudinaryPreviewImage } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons'


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
      <div className="topMargin leftAndRightPadding">
        <h1 className="sans noMargin">{singleSpot?.name}</h1>
        <p className="sans noMargin mediumFont topPadding">{singleSpot?.city}, {singleSpot?.state}, {singleSpot?.country}</p>
      </div>
      <ol className="displayFlex">
        {spotImageDetails?.map(({id, url}) => (
          <div className="leftAndRightPadding" key={id}>
            <li>{cloudinaryPreviewImage(url)}</li>
          </div>
        ))}
      </ol>
        <div>
          <p className='sans largeFont leftAndRightPadding'>Hosted by {spotOwnerDetails?.firstName} {spotOwnerDetails?.lastName}</p>
        </div>

        <div className="displayFlex spaceBetween leftAndRightPadding">
          <textarea className='xlargeSize leftAndRightPadding noBorder'>Lorem ipsum about the space</textarea>
          
          <div className="displayFlex fullPadding flexColumn whiteBackground roundedCorners blackBorder mediumSize">
            <div className="fullMargin displayFlex flexRow spaceBetween">
              <li className="blackText largeFont leftAndRightPadding sans"> ${singleSpot?.price} night</li>
              
              <div className="displayFlex alignCenter">
                <FontAwesomeIcon icon={faStar} className="redText largeFont" /> 
                <li className="displayInline fullPadding blackText largeFont sans">{typeof avgRating === 'number' ? avgRating : 'New'}</li>
              </div>
            </div>
                
            <button className="activeButtonDesign ">Reserve</button>
          </div>
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