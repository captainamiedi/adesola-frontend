/* eslint-disable react/prop-types */
import './App.css'
// import { Provider } from 'react-redux'
// import store from './store/store'
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  Routes,
  Route,
  // Link,
  // useNavigate,
  useLocation,
  Navigate,
  // Outlet,
} from "react-router-dom";
import React, { lazy } from 'react';
// import { setupAxiosInterceptors } from './Utils/AxiosConfig';

const Login = lazy(() => import('./Pages/Login'))
const Signup = lazy(() => import('./Pages/Signup'))
const Chat = lazy(() => import('./Pages/Chat'));

function App() {

  // setupAxiosInterceptors()
  const RequireAuth = ({ children }) => {
    let auth = localStorage.getItem('userToken');
    let location = useLocation();
  
    if (!auth) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    return children;
  } 

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/chat",
      element: <RequireAuth>
      <Chat />
    </RequireAuth>
,
    },
  ]);

  const PublicPage = () => {

  }


  return (
    <React.Suspense fallback={<p>Loading....</p>}> 
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
            path="/chat"
            element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
            }
          />
      </Routes>
    </React.Suspense>
    // <Provider store={store}>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //     {/* <Route element={<Dashboard />}> */}
    //       {/* <Route path="/login" element={<LoginPage />} /> */}
    //       <Route
    //         path="/chat"
    //         element={
    //             <RequireAuth>
    //               <Chat />
    //             </RequireAuth>


    //         }
    //       />
    //     {/* </Route> */}
    //   </Routes>
    // {/* // </Provider> */}
    // </BrowserRouter>
    // <RouterProvider router={router} />
  )
}

export default App
