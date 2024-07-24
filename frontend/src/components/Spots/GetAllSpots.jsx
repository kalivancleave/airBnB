import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const GetAllSpots = () => {
  const dispatch = useDispatch();
  const spotsList = useSelector(state => state.spots.spots);
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  return (
    <>
      <h1>All Spots</h1>
      <ol className="testBorder displayFlex fullPadding">
        {spotsList.map(({id, previewImage, city, state, avgRating, price}) => (
          <div key={id} className="testBorder fullPadding fullMargin">
            <NavLink to={`${id}`} className="noDecoration" >
              <li className="blackText mediumFont">{previewImage}</li>
              <li className="blackText mediumFont">{city}, {state}</li>
              <div>
                <FontAwesomeIcon icon={faStar} className="redText" /> 
                <li className="displayInline fullPadding blackText mediumFont">{avgRating}</li>
              </div>
              <li className="blackText mediumFont"> ${price} night</li>
            </NavLink>
          </div>
        ))}
      </ol>
    </>
  )
}

export default GetAllSpots