import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { fetchSpot } from "../../store/spots";
import { fetchSpotOwner } from '../../store/spots'
import { fetchReviewsForSpot } from "../../store/review";
import ReviewModal from "../Review/ReviewModal";
import OpenModalButton from "../OpenModalButton";
import DeleteReview from "../Review/DeleteReview";
import { cloudinaryPreviewImage } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons' 


const SingleSpot = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const singleSpot = useSelector(state => state.spots.spots.find(spots => spots.id === Number(id)))
  const spotImageDetails = useSelector(state => state.spots.spotImageDetails);
  const spotOwnerDetails = useSelector(state => state.spots.spotOwnerDetails);
  const spotReviews = useSelector(state => state.reviews.reviews);

  const user = useSelector(state => state.session.user)
  
  useEffect(() => {
    dispatch(fetchSpots());
    dispatch(fetchSpot(id));
    dispatch(fetchSpotOwner(id));
    dispatch(fetchReviewsForSpot(id));
  }, [dispatch, id])

  function handleClick() {
    alert("Feature coming soon")
  }

  function displayMonth(number) {
    if(number === "01") return "January"
    if(number === "02") return "February"
    if(number === "03") return "March"
    if(number === "04") return "April"
    if(number === "05") return "May"
    if(number === "06") return "June"
    if(number === "07") return "July"
    if(number === "08") return "August"
    if(number === "09") return "September"
    if(number === "10") return "October"
    if(number === "11") return "November"
    if(number === "12") return "December"
  }

  //functions to sort the reviews by date
  // function smallestToBiggest(a, b) {
  //   return new Date(a?.createdAt) - new Date(b?.createdAt)
  // }
  
  function biggestToSmallest(a, b) {
    return new Date(b?.createdAt) - new Date(a?.createdAt)
  }
  
  // let sortedReviewsSmall2Big = spotReviews.sort(smallestToBiggest)
  let sortedReviewsBig2Small = spotReviews.sort(biggestToSmallest)
  //end of date sorting logic



  
  //checking that the logged in user had not already created a review
  let reviewCreatorIds = [];

  {spotReviews.forEach(review => {
    reviewCreatorIds.push(review?.User?.id)
  })}

  function reviewCreatorCheck (reviewCreatorIds) {
    for (let i = 0; i < reviewCreatorIds?.length; i++) {
       if (user?.id === reviewCreatorIds[i]){
        return true
       }
    }
    return false
  }
  //end of review checking logic
  

  const hideMeReviews = "displayFlex alignCenter visibility" + (spotReviews.length === 0 ? "Hidden" : "");
  const hideMeReviewButton = "leftPageBorder visibility" + (user?.id === undefined || user?.id === spotOwnerDetails?.id || reviewCreatorCheck(reviewCreatorIds) === true ? "Hidden" : "")
 
  return (
    <>
  {/* spot images */}
      <div className="topMargin leftPageBorder">
        <h1 className="sans noMargin">{singleSpot?.name}</h1>
        <p className="sans mediumFont topPadding">{singleSpot?.city}, {singleSpot?.state}, {singleSpot?.country}</p>
      </div>
      <div className="displayFlex flexWrap leftPageBorder rightPageBorder">
        <div className="largeSize">
          <li>{cloudinaryPreviewImage(singleSpot?.previewImage)}</li>
        </div>
        <div>
          <ol className="displayFlex noMargin">
            {spotImageDetails?.map(({id, url}) => (
              <div className="leftAndRightPadding noMargin fullSize" key={id}>
                <li>{cloudinaryPreviewImage(url)}</li>
              </div>
            ))} 
          </ol>
        </div>
      </div>

  {/* hosted by deets */}
        <div>
          <p className='sans largeFont leftPageBorder'>Hosted by {spotOwnerDetails?.firstName} {spotOwnerDetails?.lastName}</p>
        </div>

  {/* spot description box */}
        <div className="displayFlex spaceBetween leftPageBorder rightPageBorder">
          <p className='xlargeSize fullPadding noBorder sans rightMargin mediumFont'>{singleSpot?.description}</p>

  {/* reserve box with price per night, average rating, and reserve COMING SOON */}
          <div className="displayFlex fullPadding flexColumn whiteBackground roundedCorners blackBorder mediumSize">
            <div className="fullMargin displayFlex flexRow spaceBetween">
              <li className="blackText largeFont leftAndRightPadding sans"> ${singleSpot?.price} night</li>
              
              <div className="displayFlex alignCenter">
                <FontAwesomeIcon icon={faStar} className="redText largeFont" /> 
                <li className="displayInline fullPadding blackText largeFont sans">{typeof singleSpot?.avgRating === 'number' ? singleSpot?.avgRating : 'New'}</li>
              </div>
            </div>
                
            <button className="activeButtonDesign" onClick={handleClick}>Reserve</button>
          </div>
        </div>
  
  {/* page separator */}
      <hr className="solid leftPageBorder rightPageBorder topMargin" />
      
  {/* average reviews rating and number of reviews display */}
      <div>
        <div className="displayFlex alignCenter leftPageBorder">
            <FontAwesomeIcon icon={faStar} className="redText largeFont" /> 
            <li className="displayInline fullPadding blackText largeFont sans">{typeof singleSpot?.avgRating === 'number' ? singleSpot?.avgRating : 'New'}</li>
          <div className={hideMeReviews}>
            <FontAwesomeIcon icon={faCircle} className="blackText tinyFont leftAndRightPadding"/>
            <p className="blackText largeFont sans" >{spotReviews.length} {spotReviews.length === 1 ? "review" : "reviews"}</p>
          </div>
        </div>
      </div>
      
  {/* post review button */}
      <div className={hideMeReviewButton}>
          <OpenModalButton
          className="activeButtonDesign"
          buttonText="Post Your Review"
          modalComponenet={<ReviewModal spotId={singleSpot}/>}
          />
      </div>
      
  {/* reviews display */}
      <div className="bottomPageBorder">
        {user !== null && spotOwnerDetails?.id !== user?.id && spotReviews.length === 0 ? 
          <p className="leftPageBorder blackText mediumFont sans ">Be the first to post a review!</p>
          :
        <ol>
          {sortedReviewsBig2Small.map(({id, review, User, createdAt}) => (
            <div key={id}>
              <li className="sans blackText largeFont extraTopMargin">{User.firstName}</li>
              <li className="sans darkGreyText mediumFont littleTopMargin">{displayMonth(createdAt.slice(5,7))} {createdAt.slice(0,4)}</li>
              <li className="sans blackText mediumFont fullSize topMargin">{review}</li>
             <div className={User.id === user.id ? "" : "visibilityHidden"}>
              <OpenModalButton 
                buttonText="Delete"
                modalComponenet={<DeleteReview id={id}/>}
                />
             </div>
              
            </div>
          ))}
        </ol>
        }
      </div>
    </>
  ) 
}

export default SingleSpot