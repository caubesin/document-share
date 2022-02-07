import React, {useEffect} from 'react';
import Signin from './component/signin'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from './route/private_route'
import ReRoute from './route/redirect_route';
import Document from "./component/document";
import Singup from './component/signup';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/document"></Navigate>} ></Route>

          <Route path='/document' element={
            <PrivateRoute>
              <Document></Document>
            </PrivateRoute>
            }></Route>

          <Route path='/signin' element={
            <ReRoute>
              <Signin></Signin>
            </ReRoute>
          }></Route>

          <Route path='/signup' element={
            <Singup></Singup>
          }></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
