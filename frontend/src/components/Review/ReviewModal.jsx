import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/review";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { fetchReviewsForSpot } from "../../store/review";


function ReviewModal(spot) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('')
  const [stars, setValue] = useState(0)
  const [hoverValue, setHoverValue] = useState(undefined)
  const [errors, setErrors] = useState({})

  const {closeModal} = useModal();

  const spotId = JSON.stringify(spot.spotId.id)
  
  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleSubmit = async() => {
    setErrors({})
    await dispatch(createReview({
          review,
          stars,
          spotId
        })
      )
    .then(async function reviewRefresh() {
      dispatch(fetchReviewsForSpot(spotId))
      await wait();
    })
    .then(closeModal)
    .catch(
      async (res) => {
        console.log(res)
        const data = await res.json();
        if (data) {
          setErrors(data.errors);
        }
      }
    )
  }

  const handleClick = (stars) => {
    setValue(stars)
  };

  const handleMouseOver = (stars) => {
    setHoverValue(stars)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  };

  const colors = {
    yellow: "#ffe234",
    grey: "#999999"
  }

  const starImages = Array(5).fill(0);

  const validate = () => {
    if(review.length < 10) {
      return true
    } else if (stars === Number(0)) {
      return true
    } else {
      return false
    }         
  }

  console.log(validate())
  
  return(
    <div>
      {console.log(errors)}
      <h1 className='leftPageBorder rightPageBorder blackText sans largeFont extraTopMargin'>How was your stay?</h1>
      <form onSubmit={(e) => e.preventDefault()} className='leftPageBorder rightPageBorder bottomPageBorder'>
        <textarea className='fullPadding blackText sans mediumFont fullSize averageHeight' placeholder='Leave your review here...' value={review} onChange={(e) => setReview(e.target.value)}/>
        {errors.review && <p className="redText mediumFont whiteBackground fullMargin">{errors.review}</p>}
        <div className="reviewsModalForcedWidth littleTopMargin littleBottomBorder">
        <div className="displayFlex flexRow justifyCenter alignCenter">
          {starImages.map((_, index) => {
            return (
              <FontAwesomeIcon icon={faStar} 
                key={index}
                className='xlargeFont cursorPointer'
                color={(hoverValue || stars) > index ? colors.yellow : colors.grey}
                onClick={() => handleClick(index + 1)}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={(handleMouseLeave)}
                value={stars}
              />
            )
          })}
          <label className="blackText largeFont sans littleLeftMargin">Stars</label>
        </div>
        {errors.stars && <p className="redText mediumFont whiteBackground fullMargin">{errors.stars}</p>}
        </div>
        <div className='displayFlex flexColumn justifyCenter littleBottomBorder leftAndRightMargin'>
          <button onClick={handleSubmit} className={validate() !== true ? "activeButtonDesign" : 'inactiveButtonDesign'}>Submit Your Review</button>
        </div>
      </form>
    </div>
  )  
}


export default ReviewModal;