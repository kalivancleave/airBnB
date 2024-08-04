import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";


function DeleteSpot(props) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  // const spotId = [spot.id]
 
  const deleteSpotFunction = async () => {
    await dispatch(deleteSpot(props.id))
    .then(closeModal)
    .then(window.location.reload())
    .catch(
      async (res) => {
        console.log(res) //debugging
        const data = await res.json();
        if(data) {
          console.log(data);
        }
      }
    )
      
  }

  const doNotDelete = () => {closeModal()}

  return(
    <div className="reviewsModalForcedWidth displayFlex flexColumn">
      <div className="displayFlex flexColumn alignCenter">
        <h1 className='blackText sans largeFont extraTopMargin'>Confirm Delete</h1>
        <p className='blackText sans mediumFont littleTopMargin littlebottomBorder'>Are you sure you want to remove this spot?</p>
      </div>
      <div className='displayFlex flexColumn justifyCenter littleBottomBorder leftAndRightMargin'>
        <button className="activeButtonDesign blur" onClick={() => deleteSpotFunction()}>Yes (Delete Spot)</button>
        <button className="inactiveButtonDesignOnly blur" onClick={doNotDelete}>No (Keep Spot)</button>
      </div>
    </div>
  )
}

export default DeleteSpot;