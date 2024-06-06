import React from 'react'
import classes from "./header.module.css"
import sabpaisalogo from "../../../assets/images/sabpaisalogo.png"


function Header({ display_bg_color }) {
  return (
    <nav className={`navbar navbar-expand-md p-0 ${classes.position_sticky} ${display_bg_color && classes.navbar_bg_color}`}>
      <div className={`container-fluid`}>
        <div className={`navbar-brand ${classes.logo_container}`} >
          <img src={sabpaisalogo} className={`my-2 ${classes.cob_logo}`} alt="Sabpaisa" /></div>
      </div>
    </nav>
  )
}

export default Header