import { useState } from "react";

const DetailedImageUpload = () => {
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
    setImagePreview(URL.createObjectURL(e.target.files[0]))
  }

  const uploadImage = async (e) => {
    e.preventDefault()
    setIsLoading(true);

    try {
      let imageURL;

      if(profileImage && (
        profileImage.type === "image/png" ||
        profileImage.type === "image/jpeg" ||
        profileImage.type === "image/jpg"
      )) {
        const image = new FormData()
        image.append("file", profileImage)
        image.append("cloud_name", "djnfjzocb")
        image.append("upload_preset", "airbnb")
        
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/djnfjzocb/image/upload",
        
          {
            method: "POST",
            body: image
          }
        )
        const imageData =  await response.json()
        imageURL = imageData.url.toString()
        setImagePreview(null)
      }
      console.log(imageURL) //here is where we save to a db
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>
      <h2>Upload Image to Cloudinary...</h2>
      <div>
        <div onSubmit={uploadImage}>
          <p>
            <label>Photo:</label>
            <input 
              type='file' 
              accept='image/png, image/jpeg, image/jpg' 
              name='image'
              onChange={handleImageChange}></input>
          </p>
          <p>
            {
              isLoading ? ("Uploading...") : (
                <button type="sumbit">Upload Image</button>
              )
            }
          </p>
        </div>
        <div>
          <div>
            {imagePreview && (
              <img src={imagePreview && imagePreview}
              alt="uploaded image" />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailedImageUpload;