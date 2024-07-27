import { useDispatch } from "react-redux";
import * as spotActions from '../../store/spots.js'
import { useModal } from "../../context/Modal";
import { useState } from "react";

const DeleteSpot = ({spot}) => {
  const {closeModal} = useModal();
  const dispatch = useDispatch();
  const [deleted, setDeleted] = useState(false);

  const handleClick = async () => {
    const response = await dispatch(spotActions.deleteSpot(spot.id));
    if(response) setDeleted(true)
  };

  return(
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot?</p>
      <button value={didDelete} onClick={() => handleClick()}>Yes {Delete Spot}</button>
      <button onClick={() => {closeModal()}}>No {Keep Spot}</button>
    </div>
  )
}

export default DeleteSpot;