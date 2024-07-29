import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSpots } from "../../store/spots"; 
import { deleteSpot } from "../../store/spots";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { cloudinaryPreviewImage } from "../../App";
import { Tooltip } from 'react-tooltip';
import { useNavigate } from "react-router-dom";


const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [spotId, setSpotId] = useState(null)
  const spotsList = useSelector(state => state.spots.spots);

  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  
  const userSpots = spotsList.filter((spot) => {
    return spot.ownerId === user.id
  })
  

  const deleteSpotFunction = async () => {
    await dispatch(deleteSpot(spotId))
    console.log("spot deleted")
    .then(navigate('/'))
  }


  return (
    <div className="bottomPageBorder">
      <h1 className="leftPageBorder blackText sans">Manage Spots</h1>
      {userSpots.length === 0 ? (
        <div className="leftPageBorder">
          <NavLink to='/CreateSpot'>
            <button className="activeButtonDesign">Create a New Spot</button>
          </NavLink>
        </div>
      ) : (
        <ol className="displayFlex fullPadding flexWrap justifyCenter">
        <Tooltip id='my-tooltip' />
          {userSpots.map(({id, name, previewImage, city, state, avgRating, price}) => (
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
              <div className="displayFlex spaceEvenly littleTopMargin">
                <NavLink to={`/updateSpot/${id}`} className="activeButtonDesign">Update</NavLink>
                <button className="activeButtonDesign" onClick={() => deleteSpotFunction(spot.id)}>Delete</button>
                {console.log(id)}
              </div>
            </div>
          ))}
        </ol>
      )
      }
    </div>
  )
}

export default ManageSpots;