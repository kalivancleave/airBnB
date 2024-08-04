import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import GetAllSpots from './components/Spots/GetAllSpots';
import SingleSpot from './components/Spots/GetSpot';
import 'react-tooltip/dist/react-tooltip.css'
import CreateSpot from './components/Spots/CreateSpot';
import ManageSpots from './components/Spots/ManageSpots';
import UpdateSpot from './components/Spots/UpdateSpot';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <GetAllSpots />
      },
      {
        path: ':id',
        element: <SingleSpot />
      },
      {
        path: '/createSpot',
        element: <CreateSpot />
      },
      {
        path: '/manageSpots',
        element: <ManageSpots />
      },
      {
        path: '/updateSpot/:id',
        element: <UpdateSpot />
      }
    ]
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;