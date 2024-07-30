import { useEffect, useRef } from "react";

const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();


  let imageName;

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'djnfjzocb',
      uploadPreset: 'airbnb'
    }, function(error, result) {
      console.log(result)
      console.log(result.info.public_id);
      
    });
  }, [])
  return(
    <>
    <button onClick={() => widgetRef.current.open()}>
      Upload
    </button>
    {console.log(imageName)}
    
    </>
  )
}

export default UploadWidget;