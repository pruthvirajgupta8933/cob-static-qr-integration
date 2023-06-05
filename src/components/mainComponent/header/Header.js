import React from 'react'
import classes from "./header.module.css"
import sabpaisalogo from "../../../assets/images/sabpaisa-logo-white.png"

function Header() {
  return (
<nav className={`navbar navbar-expand-md navbar-dark p-0 ${classes.position_sticky} ${classes.navbar_bg_color}`}>
  <div className="container-fluid">
    <a className="navbar-brand" href={()=>false}>
      <img src={sabpaisalogo} className={classes.cob_logo} alt="sabpaisa" /></a>
  </div>
</nav>

  )
}

export default Header