import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSpots, updateSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import UploadImage from "../Images/UploadImage";

const UpdateSpot = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spotsList = useSelector(state => state?.spots?.spots);
  const existingSpot = spotsList.filter(spot => spot?.id === Number(id))
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  const [ucountry, setCountry] = useState(existingSpot[0].country);
  const [uaddress, setAddress] = useState(existingSpot[0].address);
  const [ucity, setCity] = useState(existingSpot[0].city);
  const [ustate, setState] = useState(existingSpot[0].state);
  const [ulat, setLat] = useState(existingSpot[0].lat);
  const [ulng, setLng] = useState(existingSpot[0].lng);
  const [udescription, setDescription] = useState(existingSpot[0].description);
  const [uname, setName] = useState(existingSpot[0].name);
  const [uprice, setPrice] = useState(existingSpot[0].price);

  const updatedSpot = {
    id: id,
    country: ucountry,
    address: uaddress,
    city: ucity,
    state: ustate,
    lat: ulat,
    lng: ulng,
    description: udescription,
    name: uname,
    price: uprice
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    return dispatch(updateSpot(updatedSpot))
    .then(navigate(`/${id}`))
    .catch(async(res) => {
      const data = await res.json();
      if(data?.errors) {
        console.log(data.errors)
      }
    });
  }

  return(
    <>
      <div className='displayFlex justifyCenter bottomPageBorder'>
    
    <form className="largeSize topMargin" onSubmit={handleUpdate}>
      <h1 className='blackText xlargeFont sans'>Update your Spot</h1>

  {/* section 1     */}
      <h2 className='blackText largeFont sans'>Where&apos;s your place located?</h2>
      <p className="blackText mediumFont sans">Guests will only get your exact address once they booked a reservation.</p>
        <div>
          <div>
            <label className='mediumFont blackText sans'>
              Country
              <input
              onChange={e => setCountry(e.target.value)}
              type="text"
              placeholder="Country"
              required="required"
              value={ucountry}/>
            </label>
            {/* {errors.country && <p className="redText mediumFont whiteBackground fullMargin">{errors.country}</p>} */}
          </div>
          
          <div>
            <label className='mediumFont blackText sans'>
              Street Address
              <input
              onChange={e => setAddress(e.target.value)}
              type="text"
              placeholder='Address'
              required='required'
              value={uaddress}/>
            </label>
            {/* {errors.address && <p className="redText mediumFont whiteBackground fullMargin">{errors.address}</p>} */}
          </div>
          <div className='displayFlex alignBottom spaceBetween'>
            <div className='fullSize blackText mediumFont sans'>
              <label className='mediumFont blackText sans'>
                City
                <input
                onChange={e => setCity(e.target.value)}
                type='text'
                placeholder="City"
                required='required'
                value={ucity}/>
              </label>
              {/* {errors.city && <p className="redText mediumFont whiteBackground fullMargin">{errors.city}</p>} */}
            </div>
            <div className='rightMargin mediumFont blackText sans'>
              <p>,</p>
            </div>
            <div className='fullSize blackText mediumFont sans'>
              <label className='mediumFont blackText sans'>
                State
                <input
                onChange={e => setState(e.target.value)}
                type='text'
                placeholder='State'
                required='required'
                value={ustate}/>
              </label>
              {/* {errors.state && <p className="redText mediumFont whiteBackground fullMargin">{errors.state}</p>} */}
            </div>
          </div>

          <div className='displayFlex alignBottom spaceBetween'>
            <div className='fullSize'>
              <label className='mediumFont blackText sans'>
                Latitude
                <input
                onChange={e => setLat(e.target.value)}
                type='text'
                placeholder='Latitude'
                value={ulat}/>
              </label>
              {/* {errors.lat && <p className="redText mediumFont whiteBackground fullMargin">{errors.lat}</p>} */}
            </div>
            <div className='rightMargin mediumFont blackText sans'>
              <p>,</p>
            </div>
            <div className='fullSize'>
              <label className='mediumFont blackText sans'>
                Longitude
                <input
                onChange={e => setLng(e.target.value)}
                type='text'
                placeholder='Longitude'
                value={ulng}/>
              </label>
              {/* {errors.lng && <p className="redText mediumFont whiteBackground fullMargin">{errors.lng}</p>} */}
            </div>    
          </div>
        </div>

  {/* section 2   */}
        <div>
          <h2 className='blackText largeFont sans extraTopMargin'>Describe your place to guests</h2>
          <p className="blackText mediumFont sans">Mention the best features of your space, any special amenities 
            like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea className='textArea fullSize fullPadding darkGreyBorder mediumFont blackText sans' 
          type='text'
          placeholder='Please write at least 30 characters'
          required='required'
          minLength={30}
          onChange={e => setDescription(e.target.value)}
          value={udescription}/>
          {/* {errors.description && <p className="redText mediumFont whiteBackground fullMargin">{errors.description}</p>} */}
        </div>

  {/* section 3   */}
        <div>
          <h2 className='blackText largeFont sans extraTopMargin'>Create a title for your spot</h2>          
          <p className="blackText mediumFont sans">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          <div className='fullSize'>
            <label className='mediumFont blackText sans'>
              Name
              <input
              onChange={e => setName(e.target.value)}
              className='sans'
              type='text'
              placeholder='Name of your spot'
              required='required'
              value={uname}/>
            </label>
            {/* {errors.name && <p className="redText mediumFont whiteBackground fullMargin">{errors.name}</p>} */}
          </div>
        </div>

  {/* section 4   */}
        <div>
          <h2 className='blackText largeFont sans extraTopMargin'>Set a base price for your spot</h2>          
          <p className="blackText mediumFont sans">Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <div className='displayFlex alignCenter'>
            <label className='mediumFont blackText sans'>$</label>
            <input 
            onChange={e => setPrice(e.target.value)}
            className="littleLeftMargin sans"
            type='text'
            placeholder='Price per night (USD)'
            required='required'
            value={uprice}/>
            {/* {errors.price && <p className="redText mediumFont whiteBackground fullMargin">{errors.price}</p>} */}
          </div>

          <div>
            <UploadImage spotId={id} />
          </div>

        </div>

         <button className='activeButtonDesign' type='submit' onClick={() => {console.log("click")}}>Update your Spot</button> 

      </form>
    </div>
    </>
  )
}

export default UpdateSpot