import { useSelector } from "react-redux"
import { allSpots } from "../../store/spots"


const GetAllSpots = () => {
  const allSpots = useSelector(state => state.spots) //what do I put here to get the spots I have found??!!
  

  return (
    <>
      <h1>All Spots</h1>
      <h2>{console.log(allSpots)}</h2>
    </>
  )
}

export default GetAllSpots