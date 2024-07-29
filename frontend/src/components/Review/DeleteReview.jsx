import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/review";

function DeleteReview(id) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const reviewId = id //double check that it is returning the number of the id and not the object
 
  const deleteReviewFunction = async(id) => {
    await dispatch(deleteReview(id))
      .then(closeModal)
      .then(window.location.reload())
      .catch(
        async (res) => {
          const data = await res.json();
          if(data) {
            console.log(data)
          }
        }
      )
  }

  const doNotDelete = () => {closeModal()}

  return(
    <div className="reviewsModalForcedWidth displayFlex flexColumn">
      <div className="displayFlex flexColumn alignCenter">
        <h1 className='blackText sans largeFont extraTopMargin'>Confirm Delete</h1>
        <p className='blackText sans mediumFont littleTopMargin littlebottomBorder'>Are you sure you want to remove this review?</p>
      </div>
      <div className='displayFlex flexColumn justifyCenter littleBottomBorder leftAndRightMargin'>
        <button className="activeButtonDesign blur" onClick={() => deleteReviewFunction([reviewId.id])}>Yes (Delete Review)</button>
        <button className="inactiveButtonDesignOnly blur" onClick={doNotDelete}>No (Keep Review)</button>
      </div>
    </div>
  )
}

export default DeleteReview;