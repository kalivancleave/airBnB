import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots"; 
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";


const ManageSpots = () => {
  const dispatch = useDispatch();
  const spotsList = useSelector(state => state.spots.spots);

  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  
  const userSpots = spotsList.filter((spot) => {
    return spot.ownerId === user.id
  })
  
  return (
    <div className="bottomPageBorder leftPageBorder rightPageBorder">
      <h1 className="blackText sans">Manage Spots</h1>
      {userSpots.length === 0 ? (
        <div className="leftPageBorder">
          <NavLink to='/CreateSpot'>
            <button className="activeButtonDesign">Create a New Spot</button>
          </NavLink>
        </div>
      ) : (
        <ol className="displayFlex flexWrap noPadding fullSize justifyLeft">
        <Tooltip id='my-tooltip' />
        
          {userSpots.map(({id, name, previewImage, city, state, avgRating, price}) => (
            <div key={id} className="displayFlex frontPageSize topMargin littleBottomBorder flexColumn justifyCenter photoBox" data-tooltip-id="my-tooltip" data-tooltip-content={name} data-tooltip-place="top">
            
              <NavLink to={`/${id}`} className="noDecoration" >
                <div className="displayFlex flexColumn alignCenter">

                  <img src={previewImage} className="addlPhotoSize blur" />

                  <div className="displayFlex flexRow topAndBottomPadding spaceBetween fullSize">
                    <div className="extraLeftMargin">
                      <li className="blackText mediumFont sans">{city}, {state}</li>
                    </div>
                    <div className="extraRightMargin">
                      <FontAwesomeIcon icon={faStar} className="redText mediumFont" /> 
                      <li className="displayInline topAndBottomPadding blackText mediumFont sans">{typeof avgRating === 'number' ? avgRating : 'New'}</li>
                    </div>
                  </div>
                  <li className="blackText leftPageBorder mediumFont fullSize sans"> ${price.toFixed(2)} night</li>
                </div>
              </NavLink>

              <div className="displayFlex justifyLeft leftMargin topMargin">
                <NavLink to={`/updateSpot/${id}`} className="activeButtonDesign">Update</NavLink>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponenet={<DeleteSpot id={id} allUserSpots={userSpots}/>}
                  className='activeButtonDesign' />
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