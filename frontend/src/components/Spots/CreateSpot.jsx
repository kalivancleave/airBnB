import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createSpot } from '../../store/spots';

const CreateSpot = () => {
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [spotImages, setSpotImages] = useState([]);
  const [errors, setErrors] = useState({})

  const user = useSelector(state => state.session.user)

  const submitNewSpot = async (e) => {
    setErrors({})
    const newSpot = {}
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
    newSpot.previewImage = previewImage
    newSpot.SpotImages = spotImages
    newSpot.Owner = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }

    const payload = await dispatch(createSpot(newSpot))
    if(!payload) {
      return "There is an error with the payload to submit a new spot"
    }
  }

  return(
    <>
      <form onSubmit={(e) => {e.preventDefault(); submitNewSpot()}}>
        <h1>Create a new Spot</h1>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>
          <div>
            <label>Country</label>
            <input onChange={e => setCountry(e.target.value)}
            type="text"
            placeholder="Country"
            required="required"
            value={country} />
          </div>
          <div>
            <label>Street Address</label>
            <input onChange={e => setAddress(e.target.value)}
            type="text"
            placeholder='Address'
            required='required'
            value={address} />
          </div>
          <div className='displayFlex'>
            <label>City</label>
            <input onChange={e => setCity(e.target.value)}
            type='text'
            placeholder='City'
            required='required'
            value={city} />
            <p>,</p>
            <label>State</label>
            <input onChange={e => setState(e.target.value)}
            type='text'
            placeholder='State'
            required='required'
            value={state} />
          </div>
          <div className='displayFlex'>
            <label>Latitude</label>
            <input onChange={e => setLat(e.target.value)}
            type='text'
            placeholder='Latitude'
            value={lat} />
            <p>,</p>
            <label>Longitude</label>
            <input onChange={e => setLng(e.target.value)}
            type='text'
            placeholder='Longitude'
            value={lng} />
          </div>
          <div>
            <h2>Describe your place to guests</h2>
            <p>Mention the best features of your space, any special amenities 
              like fast wifi or parking, and what you love about the neighborhood.</p>
            <textarea onChange={e => setDescription(e.textarea.value)}
            placeholder='Please write at least 30 characters'
            required='required'
            value={description} />
          </div>
          <div>
            <h2>Create a title for your spot</h2>
            <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
            <div className='displayFlex alignCenter'>
              <label>$</label>
              <input onClick={e => setPrice(e.target.value)}
              type='text'
              placeholder='Price per night (USD)'
              required='required'
              value={price} />
            </div>
          </div>
          <div>
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot.</p>
            
          </div>

      </form>
    </>
  )
}

export default CreateSpot;