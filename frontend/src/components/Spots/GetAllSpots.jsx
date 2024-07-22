import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";

const GetAllSpots = () => {
  const dispatch = useDispatch();
  const spotsList = useSelector(state => state.spots.spots);
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  return (
    <>
      <h1>All Spots</h1>
      <ol>
        {spotsList.map(({id, previewImage, city, state, avgRating, price}) => (
          <div key={id}>
            <NavLink to={`${id}`}>
              <li>{previewImage}</li>
              <li>{city}, {state}</li>
              <li>{avgRating}</li>
              <li>${price} night</li>
            </NavLink>
          </div>
        ))}
      </ol>
    </>
  )
}

export default GetAllSpots