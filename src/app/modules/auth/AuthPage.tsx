/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    document.body.classList.add('bg-body')
    return () => {
      document.body.classList.remove('bg-body')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid'
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex flex-row w-100 h-100'>
        {/* begin::Aside */}
        <div
          className='d-flex flex-column w-50 bgi-size-cover bgi-position-center'
          style={{
            backgroundImage: `url(${toAbsoluteUrl('/media/logos/hotel2.jpg')})`,
            position: 'relative',
          }}
        >
          {/* Black overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          ></div>

          {/* Foreground image */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundImage: `url(${toAbsoluteUrl('/media/logos/logo.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>
        {/* end::Aside */}

        {/* begin::Content */}
        <div
          className='d-flex flex-center flex-column flex-column-fluid w-50 p-10 pb-lg-20'
          style={{
            backgroundColor: '#2c2c2c', // Black background for the sign-in section
            color: '#F5DEB3', // Light brown (Wheat) text color
          }}
        >
          {/* begin::Logo */}
          <h1
            className='mb-12'
            style={{
              color: '#D4AF37', // Gold color for the title
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Sign in to Prefina Hotel
          </h1>
          {/* end::Logo */}

          {/* begin::Wrapper */}
          <div
            className='w-lg-500px rounded shadow-sm p-10 p-lg-15 mx-auto'
            style={{
              backgroundColor: '#4b3832', // Dark brown for the background of the form container
              borderColor: '#D4AF37', // Gold border
              borderStyle: 'solid',
              borderWidth: '1px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Adds a subtle shadow for depth
            }}
          >
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Content */}
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
