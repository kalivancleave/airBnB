import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import { createImage } from '../../store/images';
// import { image } from '@cloudinary/url-gen/qualifiers/source';
// import UploadImage from '../Images/UploadImage';
// import UploadWidget from '../Images/UploadWidget';
// import DetailedImageUpload from '../Images/DetailedImageUpload';
// import CreateAndUploadImage from '../Images/AnotherImageWidget';

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
  const [previewImage, setPreviewImage] = useState('')
  const [imageSelected, setImageSelected] = useState("");
  const [previewStatus, setPreviewStatus] = useState(false);

  const [errors, setErrors] = useState({})

  const user = useSelector(state => state.session.user)
  const spotsList = useSelector(state => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])
  
  const id = spotsList[spotsList.length - 1]?.id + 1
  
  const submitNewSpot = async () => {
    const newSpot = {}
    setErrors({})
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

    const newImage = {}
      
      newImage.url = previewImage
      newImage.preview = previewStatus

      console.log(newImage.url)


    return dispatch(createSpot(newSpot))
    .then(dispatch(createImage(newImage, id)))
    .then(navigate(`/${id}`))
    .catch(async (res) => {
      const data = await res.json();
      if(data?.errors) {
        setErrors(data.errors)
      }
    });
  }


  const validate = () => {
    return  country.length === 0 ||
            address.length === 0 ||
            city.length === 0 ||
            state.length === 0 ||
            description.length < 30 ||
            name.length === 0 ||
            price < 0 
            //validate for first preview image once that is working
  }

  //photo upload code
  let imageURL;
  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('file', imageSelected)
    formData.append("upload_preset", "airbnb")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/djnfjzocb/image/upload",
    
      {
        method: "POST",
        body: formData
      }
    )
    const imageData =  await response.json()
    imageURL = imageData.url.toString() //this gets stored to image database
    console.log(imageData.url)
    

    setPreviewImage(imageURL) //I dont know if i need this it really is just for display at this point
  } 
  //end of photo upload code



  
  return(
    <div className='displayFlex justifyCenter bottomPageBorder'>
    
      <form className="largeSize topMargin" onSubmit={(e) => {e.preventDefault(); submitNewSpot()}}>
        <h1 className='blackText xlargeFont sans'>Create a new Spot</h1>

    {/* section 1     */}
        <h2 className='blackText largeFont sans'>Where&apos;s your place located?</h2>
        <p className="blackText mediumFont sans">Guests will only get your exact address once they booked a reservation.</p>
          <div>
            <div>
              <label className='mediumFont blackText sans'>
                Country
                <input onChange={e => setCountry(e.target.value)}
                type="text"
                placeholder="Country"
                required="required"
                value={country} />
              </label>
              {errors.country && <p className="redText mediumFont whiteBackground fullMargin">{errors.country}</p>}
            </div>
            
            <div>
              <label className='mediumFont blackText sans'>
                Street Address
                <input onChange={e => setAddress(e.target.value)}
                type="text"
                placeholder='Address'
                required='required'
                value={address} />
              </label>
              {errors.address && <p className="redText mediumFont whiteBackground fullMargin">{errors.address}</p>}
            </div>
            <div className='displayFlex alignBottom spaceBetween'>
              <div className='fullSize blackText mediumFont sans'>
                <label className='mediumFont blackText sans'>
                  City
                  <input onChange={e => setCity(e.target.value)}
                  type='text'
                  placeholder='City'
                  required='required'
                  value={city} />
                </label>
                {errors.city && <p className="redText mediumFont whiteBackground fullMargin">{errors.city}</p>}
              </div>
              <div className='rightMargin mediumFont blackText sans'>
                <p>,</p>
              </div>
              <div className='fullSize blackText mediumFont sans'>
                <label className='mediumFont blackText sans'>
                  State
                  <input onChange={e => setState(e.target.value)}
                  type='text'
                  placeholder='State'
                  required='required'
                  value={state} />
                </label>
                {errors.state && <p className="redText mediumFont whiteBackground fullMargin">{errors.state}</p>}
              </div>
            </div>

            <div className='displayFlex alignBottom spaceBetween'>
              <div className='fullSize'>
                <label className='mediumFont blackText sans'>
                  Latitude
                  <input onChange={e => setLat(e.target.value)}
                  type='text'
                  placeholder='Latitude'
                  value={lat} />
                </label>
                {errors.lat && <p className="redText mediumFont whiteBackground fullMargin">{errors.lat}</p>}
              </div>
              <div className='rightMargin mediumFont blackText sans'>
                <p>,</p>
              </div>
              <div className='fullSize'>
                <label className='mediumFont blackText sans'>
                  Longitude
                  <input onChange={e =>setLng(e.target.value)}
                  type='text'
                  placeholder='Longitude'
                  value={lng} />
                </label>
                {errors.lng && <p className="redText mediumFont whiteBackground fullMargin">{errors.lng}</p>}
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
            {errors.description && <p className="redText mediumFont whiteBackground fullMargin">{errors.description}</p>}
          </div>

    {/* section 3   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Create a title for your spot</h2>          
            <p className="blackText mediumFont sans">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <div className='fullSize'>
              <label className='mediumFont blackText sans'>
                Name
                <input onChange={e => setName(e.target.value)}
                className='sans'
                type='text'
                placeholder='Name of your spot'
                required='required'
                value={name} />
              </label>
              {errors.name && <p className="redText mediumFont whiteBackground fullMargin">{errors.name}</p>}
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
              {errors.price && <p className="redText mediumFont whiteBackground fullMargin">{errors.price}</p>}
            </div>
          </div>

    {/* section 5   */}
          <div>
            <h2 className='blackText largeFont sans extraTopMargin'>Liven up your spot with photos</h2>          
            <p className="blackText mediumFont sans">Submit a link to at least one photo to publish your spot.</p>
            
    {/* photo upload code */}
            <input 
              type='file'
              onChange={(e) => {setImageSelected(e.target.files[0]), setPreviewStatus(true)}}
            />
            <button onClick={uploadImage}>Upload</button>
    {/* end of photo upload code */}
            
            


             {/* <input 
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
            /> */}

          </div> 

         <button className={!validate() ? 'activeButtonDesign' : 'inactiveButtonDesign'} type='submit' onClick={() => {console.log("click")}}>Create Spot</button> 

      </form>
    </div>
  )
}

export default CreateSpot;