import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useOutlet } from 'react-router-dom'
import HydeLogo from '../apps/assets/images/hyde-logo.svg'

import CoverImage from '../apps/assets/images/hyde_building2.png'
import { useAuth } from '../hooks/useAuth'

const from = window.location.pathname

function NoAuthLayout () {
  const { isSignIn } = useAuth()
  const location = useLocation()
  const outlet = useOutlet()

  const { width } = useWindowDimensions()

  //Responsive helper login page functions
  function getWindowDimensions () {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  }

  function useWindowDimensions () {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions(),
    )

    useEffect(() => {
      function handleResize () {
        setWindowDimensions(getWindowDimensions())
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
  }

  if (isSignIn)
    return (
      <Navigate
        to={from !== '/' ? from : '/dashboard/summary'}
        state={{ from: location }}
        replace
      />
    )

  return (
    <div className='bg'>
      <Row>
        {width < 1180 ? null : (
          <Col style={{ height: '100%', width: 675 }}>
            <img
              src={CoverImage}
              alt='hyde cover'
              className='cover-image'
              style={{ height: '100vh' }}
            />
          </Col>
        )}
        <Col flex='1 1 auto' style={{ textAlign: 'center' }}>
          <div className='hyde-logo'>
            <img src={HydeLogo} alt='hyde logo' />
            {outlet}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default NoAuthLayout
