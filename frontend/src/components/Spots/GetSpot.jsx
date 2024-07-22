import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";

const SingleSpot = () => {
  const { id } = useParams();
  console.log(id)
  const dispatch = useDispatch();
  const singleSpot = useSelector(state => state.spots.spots.find(
    spot => spot.id === id)
  );
  console.log(state.spots.spots[id].id) //i need single spot to return this result
  console.log(singleSpot)
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])
  
  return (
    <div>
      {console.log(SingleSpot)}

      
    </div>
  ) 
}

export default SingleSpot