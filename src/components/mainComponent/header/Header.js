import React from 'react'
import classes from "./header.module.css"
import sabpaisalogo from "../../../assets/images/sabpaisalogo.png"
import { Link } from 'react-router-dom/cjs/react-router-dom'


function Header({ display_bg_color }) {
  return (
    <nav className={`navbar navbar-expand-md p-1 ${classes.position_sticky} ${display_bg_color && classes.navbar_bg_color}`}>
      <div className={`container-fluid`}>
        <div className={`navbar-brand ${classes.logo_container}`} >
          <Link to={'/'}>
            <img src={sabpaisalogo} className={`my-2 ${classes.cob_logo}`} alt="Sabpaisa" />
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Header