import React from 'react'
import Nodatafound from "../../assets/images/Nodatafound.png"
import { Link } from 'react-router-dom'

const UrlNotFound = () => {
  return (
    <div>
    <img alt="" src={Nodatafound} className="mw-100 h-100" />
            {/* <p style={{textAlign:"center"}}>
              <Link to="/">Go to Home </Link>
            </p> */}
            </div>
  )
}

export default UrlNotFound
