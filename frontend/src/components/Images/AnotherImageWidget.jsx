import { useState } from "react"

const CreateAndUploadImage = () => {

  const [imageSelected, setImageSelected] = useState("");


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

    setPreviewImage(imageURL)
  
  }







  return(
    <>
      <input
        type="file"
        onChange={(e) => {setImageSelected(e.target.files[0]), setPreviewStatus(true)}}
        placeholder="Preview Image URL" 
      />
      <button onClick={uploadImage}>Upload</button>
    </>
  )
  

}

export default CreateAndUploadImage;