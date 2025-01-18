import React from 'react'
import Weather from './components/Weather'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <div className='app'>
      <Weather/>
    </div>
    </>
  )
}

export default App