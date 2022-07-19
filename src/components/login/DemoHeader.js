import React, { useState } from "react";
import { Link } from "react-router-dom";
import sabpaisalogo_black from '../../assets/images/sabpaisalogo.png'

function DemoHeader() {
    const [show,setShow] = useState(false)
  return (
      <header className="header-m">
        <nav className="navbar navbar-expand-lg navbar-light bg-white pt-0 pb-0">
          <a className="navbar-brand" href={()=>false} pt-0 pb-0>
            <img src={sabpaisalogo_black} alt="sabpaisa" className="logo-h" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            // data-target="#navbarSupportedContent"
            // aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={()=>{setShow(!show)}}
          >
            <span className="navbar-toggler-icon" />

          </button>
          <div className={`collapse navbar-collapse ${show ? 'show':'hide'}`} id="">
            <ul className="navbar-nav ml-auto list-items">
              <li className="nav-item active l-item">
                <a className="nav-link l-link text-primary"  href="https://sabpaisa.in/"
                    target="_blank"
                    rel="noreferrer noopener" >
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-primary"  href= "https://sabpaisa.in/sabpaisa-apis/"
              target="_blank"
              rel="noreferrer noopener">
                  APIs
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-primary" 
              target="_blank"
              href="https://sabpaisa.in/"
              rel="noreferrer noopener">
                  Developers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-primary" target="_blank"
              href="https://sabpaisa.in/"
              rel="noreferrer noopener">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-primary" to="/login-page">Login</Link>
              </li>
              <li className="nav-item ">
                <Link to="/Registration" className="nav-link text-primary">Sign up</Link>
              </li>
              <li className="nav-item tel-no">
                <a className="nav-link whtcolr" href={()=>false}>
                  Call - 011 4173 3223
                </a>
              </li>
            </ul>
          
          </div>
        </nav>
      </header>
  );
}

export default DemoHeader;
