import React from 'react'
import { Link } from 'react-router-dom'

import APP_STORE_LOGO from '../components/assets/appStore.png'
import GOOGLE_STORE_LOGO from '../components/assets/googlePlay.png'

function ConfirmRegistrationPage () {
  return (
    <div style={{ marginTop: 50, color: 'white' }}>
      <h1 style={{ color: 'white' }}>Congratulations!</h1>
      <h3 style={{ color: 'white' }}>Welcome to Hyde heritage!</h3>
      <p>
        If you're juristic click this <Link to='signin'> link </Link> to signin
      </p>
      <p>
        If you're customers please sign in to use ours service on mobile
        application
      </p>
      <a href={'https://apps.apple.com/th/app/hyde-heritage/id1635909904'}
         target={'_blank'}
         rel='noreferrer'>
        <img src={APP_STORE_LOGO}
             alt={'app store logo'}
             width={265} />
      </a><br />
      <a href={'https://play.google.com/store/apps/details?id=com.hydeproject'}
         target={'_blank'}
         rel='noreferrer'>
        <img src={GOOGLE_STORE_LOGO}
             alt={'app store logo'}
             width={250} />
      </a>
    </div>
  )
}

export default ConfirmRegistrationPage
