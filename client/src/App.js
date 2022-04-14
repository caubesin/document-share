import React from 'react';
import Signin from './component/signin'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from './route/private_route'
import ReRoute from './route/redirect_route';
import Main from "./component/main";
import Singup from './component/signup';
import Error from './component/error';
import ShareLink from './component/share-link';

function App() {
  return (
    <>
      <BrowserRouter /*basename={process.env.PUBLIC_URL}*/>
        <Routes>
          <Route path='/' element={
            <Navigate to="/main"></Navigate>
          }></Route>
          <Route  path='/main' element={
            <PrivateRoute>
              <Main></Main>
            </PrivateRoute>
          }>
            <Route path=':path' element={
              <PrivateRoute>
                <Main></Main>
              </PrivateRoute>
            }></Route>
          </Route>

          <Route path='/signin' element={
            <ReRoute>
              <Signin></Signin>
            </ReRoute>
          }>
            <Route path=':path' element={
              <ReRoute>
                <Signin></Signin>
              </ReRoute>
            }></Route>
          </Route>

          <Route path='/signup' element={
            <Singup></Singup>
          }></Route>

        <Route path='/error' element={
          <Error></Error>
        }></Route>

        <Route path='/sharelink' element={
          <PrivateRoute>
            <ShareLink></ShareLink>
          </PrivateRoute>
        }>
          <Route path=':link' element={
            <PrivateRoute>
            <ShareLink></ShareLink>
          </PrivateRoute>
          }></Route>
        </Route>

        <Route path='*' element={
          <Error status={404}></Error>
        }></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
