import React from 'react'
import { Link } from 'react-router-dom'

function AlertBox(props) {
    const {heading, message, linkUrl, linkName, bgColor } = props

  return (
    <div className={`alert NunitoSans-Regular ${bgColor}`} role="alert" >
    <h4 className="alert-heading">{heading}</h4>
    <p>{message} </p>
    <hr />
    <Link className="btn btnbackground text-white" to={linkUrl}>{linkName}</Link>
  </div>
  )
}

export default AlertBox