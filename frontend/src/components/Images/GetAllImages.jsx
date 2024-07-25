import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchImages } from "../../store/images";
import { cloudinaryPreviewImage } from "../../App";

const GetAllImages = () => {
  const dispatch = useDispatch();
  const imageList = useSelector(state => state.images.images) //remember <state.(what it is called in the store).(what it is called in the reducer)>
  console.log(state.images + " imageList")

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch])

  return (
    <>
      {imageList.map(({spotId, url}) => (
        <div key={imageList.id}>
          <li>{cloudinaryPreviewImage(url)}</li>
        </div>
      ))}
    </>
  )
}

export default GetAllImages