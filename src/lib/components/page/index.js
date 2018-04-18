import React from 'react'
import PropTypes from 'prop-types'

function Page (props) {
  const {
    children
  } = props

  return (
    <div className='ssr-page'>
      { children }
    </div>
  )
}

Page.propTypes = {
  children: PropTypes.element.isRequired
}

export default Page
