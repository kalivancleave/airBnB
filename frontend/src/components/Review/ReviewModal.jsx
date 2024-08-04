import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/review";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


function ReviewModal(spot) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('')
  const [stars, setValue] = useState(0)
  const [hoverValue, setHoverValue] = useState(undefined)
  const [errors, setErrors] = useState({})

  const {closeModal} = useModal();

  const spotId = JSON.stringify(spot.spotId.id)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({})
    return dispatch(
      createReview({
        review,
        stars,
        spotId
      })
    )
    .then(closeModal)
    .then(window.location.reload())
    .catch(
      async (res) => {
        const data = await res.json();
        if (data) {
          setErrors(data);
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
    return  review.length < 10 ||
            stars === 0
  }
  
  return(
    <div>
      <h1 className='leftPageBorder rightPageBorder blackText sans largeFont extraTopMargin'>How was your stay?</h1>
      <form onSubmit={handleSubmit} className='leftPageBorder rightPageBorder bottomPageBorder'>
        <textarea className='fullPadding blackText sans mediumFont fullSize averageHeight' placeholder='Leave your review here...' value={review} onChange={(e) => setReview(e.target.value)}/>
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
        </div>
        <button onClick={handleSubmit} className={!validate() ? "activeButtonDesign" : 'inactiveButtonDesign'}>Submit Your Review</button>
      </form>
    </div>
  )  
}


export default ReviewModal;