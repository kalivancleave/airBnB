import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { cloudinaryPreviewImage } from "../../App";
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
      <ol className="displayFlex fullPadding flexWrap justifyCenter">
      <Tooltip id='my-tooltip' />
        {spotsList.map(({id, name, previewImage, city, state, avgRating, price}) => (
          <div key={id} className="fullPadding fullMargin photoBox" data-tooltip-id="my-tooltip" data-tooltip-content={name} data-tooltip-place="top">
            <NavLink to={`/${id}`} className="noDecoration" >
              <li className="blur">{cloudinaryPreviewImage(previewImage)}</li>
              <div className="displayFlex flexRow spaceBetween fullPadding">
                <div>
                  <li className="blackText largeFont sans">{city}, {state}</li>
                </div>
                <div>
                  <FontAwesomeIcon icon={faStar} className="redText largeFont" /> 
                  <li className="displayInline fullPadding blackText largeFont sans">{typeof avgRating === 'number' ? avgRating : 'New'}</li>
                </div>
              </div>
              <li className="blackText largeFont leftAndRightPadding sans"> ${price} night</li>
            </NavLink>
          </div>
        ))}
      </ol>
    </>
  )
}

export default GetAllSpots