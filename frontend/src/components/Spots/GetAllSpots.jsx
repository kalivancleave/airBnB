import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';


const GetAllSpots = () => {
  const dispatch = useDispatch();
  const spotsList = useSelector(state => state.spots.spots);
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])
  console.log(spotsList)
  
  
  return (
    <>
      <ol className="displayFlex flexWrap noMargin noPadding fullSize justifyLeft">
      <Tooltip id='my-tooltip' />

        {spotsList.map(({id, name, previewImage, city, state, avgRating, price}) => (
          <div key={id} className="displayFlex frontPageSize topMargin littleBottomBorder justifyCenter photoBox" data-tooltip-id="my-tooltip" data-tooltip-content={name} data-tooltip-place="top">
            
            <NavLink to={`/${id}`} className="noDecoration" >
              <div className="displayFlex flexColumn alignCenter">

                <img src={previewImage} className="addlPhotoSize blur" />

                <div className="displayFlex flexRow spaceBetween fullPadding">
                  <div>
                    <li className="blackText mediumFont sans">{city}, {state}</li>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faStar} className="redText mediumFont" /> 
                    <li className="displayInline fullPadding blackText mediumFont sans">{typeof avgRating === 'number' ? avgRating : 'New'}</li>
                  </div>
                </div>
                <li className="blackText mediumFont leftAndRightPadding sans"> ${price} night</li>
              </div>
            </NavLink>
              
          </div>
        ))}

      </ol>
    </>
  )
}

export default GetAllSpots