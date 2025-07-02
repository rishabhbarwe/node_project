import React from 'react';
import Signup from './screens/Signup';
import Login from './screens/Login';
import OwnerDashboard from '../src/screens/Owner/OwnerDashboard';
import TenantDashboard from '../src/screens/Tenant/TenantDashboard';
import TenantDetails from '../src/screens/Owner/TenantDetails';
import RentOverview from '../src/screens/Owner/RentOverview';
import Myproperties from '../src/screens/Owner/Myproperties';
import TenantRequests from '../src/screens/Tenant/TenantRequests';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import { Store } from './reduxsetup/Store';
import Messages from '../src/screens/Tenant/Messages';
import ForgotPassword from './screens/ForgotPassword';



const App = ()=>{

  let token = localStorage.getItem("token");
  let usertype = null;

  const data = localStorage.getItem("signupdata");
  if (data) {
    try {
      usertype = JSON.parse(data).user.usertype;
    } catch (e) {
      console.error("Invalid JSON in localStorage for signupdata");
    }
  }


      return(
         
            <Provider store={Store}>
                <BrowserRouter>
               <Routes>
                  <Route path='/' element={token ? usertype === "tenant" ? <TenantDashboard/>:<OwnerDashboard/> : <Login/> }></Route>
                  <Route path='/login' element={<Login/>}></Route>
                  <Route path='/tenant' element={<TenantDashboard/>}></Route>
                  <Route path='/signup' element={<Signup/>}></Route>
                  <Route path='/owner' element={<OwnerDashboard/>}></Route>
                  <Route path='/forgot' element={<ForgotPassword/>}></Route>

                  {/*Owner side url bar routes */}
                  <Route path='/teantdetailsowner' element={<TenantDetails/>}></Route>
                  <Route path='/rentoverviewowner' element={<RentOverview/>}></Route>
                  <Route path='/propertiesowner' element={<Myproperties/>}></Route>

                  {/*end */}
                  
                  {/*Tenant side url bar routes */}
                   <Route path='/tenantrequest' element={<TenantRequests/>}></Route>
                   <Route path='/messages' element={<Messages/>}></Route>
                  


                  

               </Routes>
            
            
            </BrowserRouter>
            </Provider>
        
        
      )
}
export default App

