import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import UploadImage from '../Images/UploadImage';

const CreateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [errors, setErrors] = useState([])

  const user = useSelector(state => state.session.user)
  const spotsList = useSelector(state => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  const submitNewSpot = async () => {
    const newSpot = {}
    setErrors([])
    newSpot.id = spotsList.length - 1
    newSpot.ownerId = user.id
    newSpot.address = address
    newSpot.city = city
    newSpot.state = state
    newSpot.country = country
    newSpot.lng = lng
    newSpot.lat = lat
    newSpot.name = name
    newSpot.description = description
    newSpot.price = price
    newSpot.Owner = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }

    const payload = await dispatch(createSpot(newSpot))
    if(!payload) {
      return "There is an error with the payload to submit a new spot"
    } else {
      setErrors(payload)
    }

    navigate('/')
  }

  return(
    <div className='displayFlex justifyCenter bottomPageBorder'>
      {errors.map(error => (
          {error}
      ))}
    
      <form className="largeSize topMargin" onSubmit={(e) => {e.preventDefault(); submitNewSpot()}}>
        <h1 className='blackText xlargeFont sans'>Create a new Spot</h1>

    {/* section 1     */}
        <h2 className='blackText largeFont sans'>Where&apos;s your place located?</h2>
        <p className="blackText mediumFont sans">Guests will only get your exact address once they booked a reservation.</p>
          <div>
            <div>
              <label className='mediumFont blackText sans'>Country</label>
              <input onChange={e => setCountry(e.target.value)}
              type="text"
              placeholder="Country"
              required="required"
              value={country} />
            </div>
            <div>
              <label className='mediumFont blackText sans'>Street Address</label>
              <input onChange={e => setAddress(e.target.value)}
              type="text"
              placeholder='Address'
              required='required'
              value={address} />
            </div>
            <div className='displayFlex alignBottom spaceBetween'>
              <div className='fullSize blackText mediumFont sans'>
                <label className='mediumFont blackText sans'>City</label>
                <input onChange={e => setCity(e.target.value)}
                type='text'
                placeholder='City'
                required='required'
                value={city} />
              </div>
              <div className='rightMargin mediumFont blackText sans'>
                <p>,</p>
              </div>
              <div className='fullSize blackText mediumFont sans'>
                <label className='mediumFont blackText sans'>State</label>
                <input onChange={e => setState(e.target.value)}
                type='text'
                placeholder='State'
                required='required'
                value={state} />
              </div>
            </div>

            <div className='displayFlex alignBottom spaceBetween'>
              <div className='fullSize'>
                <label className='mediumFont blackText sans'>Latitude</label>
                <input onChange={e => setLat(e.target.value)}
                type='text'
                placeholder='Latitude'
                value={lat} />
              </div>
              <div className='rightMargin mediumFont blackText sans'>
                <p>,</p>
              </div>
              <div className='fullSize'>
                <label className='mediumFont blackText sans'>Longitude</label>
                <input onChange={e =>setLng(e.target.value)}
                type='text'
                placeholder='Longitude'
                value={lng} />
              </div>    
            </div>
          </div>

    {/* section 2   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Describe your place to guests</h2>
            <p className="blackText mediumFont sans">Mention the best features of your space, any special amenities 
              like fast wifi or parking, and what you love about the neighborhood.</p>
            <textarea className='textArea fullSize fullPadding darkGreyBorder mediumFont blackText sans' 
            onChange={e => setDescription(e.target.value)}
            type='text'
            placeholder='Please write at least 30 characters'
            required='required'
            minLength={30}
            value={description} />
          </div>

    {/* section 3   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Create a title for your spot</h2>          
            <p className="blackText mediumFont sans">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <div className='fullSize'>
              <label className='mediumFont blackText sans'>Name</label>
              <input onChange={e => setName(e.target.value)}
              className='sans'
              type='text'
              placeholder='Name of your spot'
              required='required'
              value={name} />
            </div>
          </div>

    {/* section 4   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Set a base price for your spot</h2>          
            <p className="blackText mediumFont sans">Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <div className='displayFlex alignCenter'>
              <label className='mediumFont blackText sans'>$</label>
              <input onChange={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Price per night (USD)'
              required='required'
              value={price} />
            </div>
          </div>

    {/* section 5   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Liven up your spot with photos</h2>          
            <p className="blackText mediumFont sans">Submit a link to at least one photo to publish your spot.</p>
            
            <UploadImage />
            

            <input
              // onClick={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Preview Image URL'
              required='required'
              // value={price} 
            />

            <input 
              // onClick={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Image URL'
              // value={price} 
            />  
            <input 
              // onClick={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Image URL'
              // value={price} 
            /> 
            <input 
              // onClick={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Image URL'
              // value={price} 
            /> 
            <input 
              // onClick={e => setPrice(e.target.value)}
              className="littleLeftMargin sans"
              type='text'
              placeholder='Image URL'
              // value={price} 
            />  
          </div>

         <button className='activeButtonDesign' type='submit' onClick={() => {console.log("click")}}>Create Spot</button> 

      </form>
    </div>
  )
}

export default CreateSpot;