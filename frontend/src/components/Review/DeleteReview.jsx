import { useDispatch } from "react-redux";
import { fetchReviewsForSpot } from "../../store/review";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/review";

function DeleteReview(props) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const deleteReviewFunction = async() => {
    await dispatch(deleteReview(props.id))
      .then(async function reviewRefresh() {
        dispatch(fetchReviewsForSpot(props.spotInfo.id))
        await wait();
      })
      .then(closeModal)
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
        <button className="activeButtonDesign blur" onClick={() => deleteReviewFunction()}>Yes (Delete Review)</button>
        <button className="inactiveButtonDesignOnly blur" onClick={doNotDelete}>No (Keep Review)</button>
      </div>
    </div>
  )
}

export default DeleteReview;