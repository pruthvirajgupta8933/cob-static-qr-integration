import React from 'react'
import classes from "./header.module.css"
import sabpaisalogo from "../../../assets/images/sabpaisalogo.png"


function Header() {
  return (
    <nav className={`navbar navbar-expand-md navbar-dark p-0 ${classes.position_sticky} headerBg`}>
      <div className={`container-fluid`}>
        <div className={`navbar-brand ${classes.logo_container}`} >
          <img src={sabpaisalogo} className={classes.cob_logo} alt="Sabpaisa" /></div>
      </div>
    </nav>

  )
}

export default Header