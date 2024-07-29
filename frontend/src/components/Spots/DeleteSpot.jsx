import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";



function DeleteSpot(id) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const spotId = [id.id]
 
  const deleteSpotFunction = async (id) => {
    await dispatch(deleteSpot(id))
    .then(closeModal)
    .then(window.location.reload())
    .catch(
      async (res) => {
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
      <div className='displayFlex flexRow justifyCenter littleBottomBorder'>
        <button className="inactiveButtonDesignOnly" onClick={doNotDelete}>No</button>
        <button className="activeButtonDesign" onClick={() => deleteSpotFunction(spotId)}>Delete</button>
      </div>
    {console.log(id)}
    </div>
  )
}

export default DeleteSpot;