import React from "react"
import classes from "./Home/home.module.css"
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png"


const HomeContent =()=>{
   return(
    <>
     <div className="row">
        <div className="col-sm-9 d-flex flex-wrap justify-content-center">

          <div
            className="col-lg-4"
            data-aos="fade-up"
          >
            <div className="icon text-primary mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="M0 0h24v24H0z"></path>
                  <path
                    d="M7 3h10a4 4 0 110 8H7a4 4 0 110-8zm0 6a2 2 0 100-4 2 2 0 000 4z"
                    fill="#335EEA"
                  ></path>
                  <path
                    d="M7 13h10a4 4 0 110 8H7a4 4 0 110-8zm10 6a2 2 0 100-4 2 2 0 000 4z"
                    fill="#335EEA"
                    opacity=".3"
                  ></path>
                </g>
              </svg>{" "}
            </div>
            <h5 className="font-weight-bold">Built for developers</h5>
            <p className="text-muted mb-6 mb-md-0">
              Our kit is built to make your life easier. Variables, build
              tooling, documentation, and reusable components.
            </p>
          </div>

          <div
            className="col-lg-4"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            <div className="icon text-primary mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="M0 0h24v24H0z"></path>
                  <path
                    d="M5.5 4h4A1.5 1.5 0 0111 5.5v1A1.5 1.5 0 019.5 8h-4A1.5 1.5 0 014 6.5v-1A1.5 1.5 0 015.5 4zm9 12h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5z"
                    fill="#335EEA"
                  ></path>
                  <path
                    d="M5.5 10h4a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-7A1.5 1.5 0 015.5 10zm9-6h4A1.5 1.5 0 0120 5.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7A1.5 1.5 0 0114.5 4z"
                    fill="#335EEA"
                    opacity=".3"
                  ></path>
                </g>
              </svg>{" "}
            </div>
            <h5 className="font-weight-bold">Designed to be modern</h5>
            <p className="text-muted mb-6 mb-md-0">
              Designed with the latest design trends in mind. Our kit feels
              modern, minimal, and beautiful.
            </p>
          </div>

          <div
            className="col-lg-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="icon text-primary mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="M0 0h24v24H0z"></path>
                  <path
                    d="M17.272 8.685a1 1 0 111.456-1.37l4 4.25a1 1 0 010 1.37l-4 4.25a1 1 0 01-1.456-1.37l3.355-3.565-3.355-3.565zm-10.544 0L3.373 12.25l3.355 3.565a1 1 0 01-1.456 1.37l-4-4.25a1 1 0 010-1.37l4-4.25a1 1 0 011.456 1.37z"
                    fill="#335EEA"
                  ></path>
                  <rect
                    fill="#335EEA"
                    opacity=".3"
                    transform="rotate(15 12 12)"
                    x="11"
                    y="4"
                    width="2"
                    height="16"
                    rx="1"
                  ></rect>
                </g>
              </svg>{" "}
            </div>
            <h5 className="font-weight-bold">Documentation for everything</h5>
            <p className="text-muted mb-0">
              We've written extensive documentation for components and tools,
              so you never have to reverse engineer anything.
            </p>
          </div>
        </div>

        <div className={`col-lg-3 ${classes.mobile_d_none}`}>
          <img
            src={onlineshopinglogo}
            width={400}
            alt="SabPaisa"
            title="SabPaisa"
            className={`${classes.banner_image}`}
          />
        </div>
      </div>
      <br />
      <br />
      <br /><br />
      <br />
     
    </>
)
        }
        

export default HomeContent;