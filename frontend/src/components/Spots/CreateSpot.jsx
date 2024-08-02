import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import { createImage } from '../../store/images';

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
  const [imageSelected, setImageSelected] = useState("");
  //question to check if the photo has been uploaded
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [uploadPhoto2, setUploadPhoto2] = useState(false);
  const [uploadPhoto3, setUploadPhoto3] = useState(false);
  const [uploadPhoto4, setUploadPhoto4] = useState(false);
  const [uploadPhoto5, setUploadPhoto5] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false) //button specific
  const [isLoading2, setIsLoading2] = useState(false) //button specific
  const [isLoading3, setIsLoading3] = useState(false) //button specific
  const [isLoading4, setIsLoading4] = useState(false) //button specific
  const [isLoading5, setIsLoading5] = useState(false) //button specific
  const [imagesToUpload, setImagesToUpload] = useState([]);

  const [errors, setErrors] = useState({})

  const user = useSelector(state => state.session.user)
  const spotsList = useSelector(state => state.spots.spots);



  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

    
  const id = spotsList[spotsList.length - 1]?.id + 1
  
  const validate = () => {
    return  country.length === 0 ||
            address.length === 0 ||
            city.length === 0 ||
            state.length === 0 ||
            description.length < 30 ||
            name.length === 0 ||
            price < 0 ||
            uploadPhoto === false ||
            readyToSubmit === false
  }

  //photo upload code
  let imageURL;
  const uploadImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    setImagesToUpload([...imagesToUpload, imageURL])
    

    setUploadPhoto(true) //validation
    setReadyToSubmit(true)
    setIsLoading(false)
  } 

  let imageURL2;
  const uploadImage2 = async (e) => {
    e.preventDefault();
    setIsLoading2(true);
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
    imageURL2 = imageData.url.toString() //this gets stored to image database
    setImagesToUpload([...imagesToUpload, imageURL2])


    setUploadPhoto2(true) //validation
    setReadyToSubmit(true)
    setIsLoading2(false)
  } 

  let imageURL3;
  const uploadImage3 = async (e) => {
    e.preventDefault();
    setIsLoading3(true);
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
    imageURL3 = imageData.url.toString() //this gets stored to image database
    setImagesToUpload([...imagesToUpload, imageURL3])
 
    setUploadPhoto3(true) //validation
    setReadyToSubmit(true)
    setIsLoading3(false)
  } 

  let imageURL4;
  const uploadImage4 = async (e) => {
    e.preventDefault();
    setIsLoading4(true);
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
    imageURL4 = imageData.url.toString() //this gets stored to image database
    setImagesToUpload([...imagesToUpload, imageURL4])


    setUploadPhoto4(true) //validation
    setReadyToSubmit(true)
    setIsLoading4(false)
  } 

  let imageURL5;
  const uploadImage5 = async (e) => {
    e.preventDefault();
    setIsLoading5(true);
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
    imageURL5 = imageData.url.toString() //this gets stored to image database
    setImagesToUpload([...imagesToUpload, imageURL5])

    setUploadPhoto5(true) //validation
    setReadyToSubmit(true)
    setIsLoading5(false)
  } 
  
  console.log(...imagesToUpload)

  //end of photo upload code

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const submitNewSpot = async () => {
    const newSpot = {}
    setErrors({})
    newSpot.id = id
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

    return dispatch(createSpot(newSpot))
    .then(async function uploadImages() {
      let newImage = {}
      //console.log (imagesToUpload.length + " hello from in the .then statment")
      for (let i = 0; i < imagesToUpload.length; i++) {
        let imageToUpload = imagesToUpload[i]
          newImage.url = imageToUpload
          if(i === 0) {
            newImage.preview = true
          } else {
            newImage.preview = false
          }
          console.log (newImage + " each one should be a new Image")
          console.log(newSpot.id + " does new spot.id exist yet?")
        dispatch(createImage(newImage, id))
      }
      await wait();
    })
    .then(navigate(`/${id}`))
    .catch(async (res) => {
      const data = await res.json();
      if(data?.errors) {
        setErrors(data.errors)
      }
    });
  }

  const hideMeUploadButton = "visibility" + (uploadPhoto === true ? "Hidden" : "")
  const hideMeUploadButton2 = "visibility" + (uploadPhoto2 === true ? "Hidden" : "")
  const hideMeUploadButton3 = "visibility" + (uploadPhoto3 === true ? "Hidden" : "")
  const hideMeUploadButton4 = "visibility" + (uploadPhoto4 === true ? "Hidden" : "")
  const hideMeUploadButton5 = "visibility" + (uploadPhoto5 === true ? "Hidden" : "")
  const hideMeLoadingText = 'noMargin noPadding visibility' + (isLoading === true ? "" : "Hidden")
  const hideMeLoadingText2 = 'noMargin noPadding visibility' + (isLoading2 === true ? "" : "Hidden")
  const hideMeLoadingText3 = 'noMargin noPadding visibility' + (isLoading3 === true ? "" : "Hidden")
  const hideMeLoadingText4 = 'noMargin noPadding visibility' + (isLoading4 === true ? "" : "Hidden")
  const hideMeLoadingText5 = 'noMargin noPadding visibility' + (isLoading5 === true ? "" : "Hidden")

  
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
            
    {/* photo upload code THIS WORKS... DONT FLUFF WITH THIS*/}
            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              required='required'
              onChange={(e) => {setImageSelected(e.target.files[0])}}
            />
            <p className={hideMeLoadingText}>...Loading</p>
            <button className={hideMeUploadButton} onClick={uploadImage}>Upload</button>

            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              onChange={(e) => {setImageSelected(e.target.files[0])}}
            />
            <p className={hideMeLoadingText2}>...Loading</p>
            <button className={hideMeUploadButton2} onClick={uploadImage2}>Upload</button>

            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              onChange={(e) => {setImageSelected(e.target.files[0])}}
            />
            <p className={hideMeLoadingText3}>...Loading</p>
            <button className={hideMeUploadButton3} onClick={uploadImage3}>Upload</button>

            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              onChange={(e) => {setImageSelected(e.target.files[0])}}
            />
            <p className={hideMeLoadingText4}>...Loading</p>
            <button className={hideMeUploadButton4} onClick={uploadImage4}>Upload</button>

            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              onChange={(e) => {setImageSelected(e.target.files[0])}}
            />
            <p className={hideMeLoadingText5}>...Loading</p>
            <button className={hideMeUploadButton5} onClick={uploadImage5}>Upload</button>


    {/* end of photo upload code */}
          </div> 

         <button className={!validate() ? 'activeButtonDesign' : 'inactiveButtonDesign'} type='submit' onClick={() => {console.log("click")}}>Create Spot</button> 

      </form>
    </div>
  )
}

export default CreateSpot;