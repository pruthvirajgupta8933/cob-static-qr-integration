import React, { useState, useRef, useEffect } from 'react'
import IdleTimer from 'react-idle-timer'
import Modal from 'react-modal'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/auth'
import { TIMEOUT } from '../config'



// console.log(TIMEOUT)
Modal.setAppElement('#root')

function IdleTimerContainer (props) {

  const dispatch  = useDispatch();  
  const {fnLogout} = props
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const idleTimerRef = useRef(null)
  const sessionTimeoutRef = useRef(null)


  const onIdle = () => {
    // console.log('User is idle')
    setModalIsOpen(true)
    sessionTimeoutRef.current = setTimeout(logOut, 10000)
  }




  const logOut = () => {
    setModalIsOpen(false)
    setIsLoggedIn(false)
    fnLogout(false)
    dispatch(logout())
    clearTimeout(sessionTimeoutRef.current)
    // console.log('User has been logged out')
  }
  const stayActive = () => {
    setModalIsOpen(false)
    clearTimeout(sessionTimeoutRef.current)
    // console.log('User is active')
  }

  const onAction = e => {
    // console.log("user did something");
    if(isLoggedIn){
        
        sessionStorage.setItem("expiredTime", Date.now() + 1000 * TIMEOUT);
        // console.log("log-1")
        // console.log("date-1",Date.now())
        // console.log("date-2",Date.now() + 1000*10 )
    }
  };

  useEffect(() => {
    if(isLoggedIn){
        sessionStorage.setItem("expiredTime", Date.now() + 1000 * TIMEOUT );
        // console.log("log-2")
        // console.log(Date.now())
    }
  
   
    return () => {
        sessionStorage.removeItem("expiredTime")
    //   console.log("run fall back function")
    }


  }, [isLoggedIn])
  

  return (
    <div>
      {/* {isLoggedIn ? <h2>Hello Abhishek</h2> : <h2>Hello Guest</h2>} */}
      <IdleTimer
        ref={idleTimerRef}
        timeout={1000 * TIMEOUT}
        onIdle={onIdle}
        onAction={onAction}
        crossTab={{
            type: 'simulate'
        }}

      />
      <Modal isOpen={modalIsOpen}>

      {/* <div className="" tabIndex={-1} role="dialog"> */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">You've been idle for a while!</h5>
              
            </div>
            <div className="modal-body">
              <p>You will be logged out soon</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={logOut}>Log me out</button>
              <button type="button" className="btn btn-primary" onClick={stayActive}>Keep me signed in</button>
            </div>
          </div>
        </div>
      {/* </div> */}
      {/* <div className="" >
        <h2>You've been idle for a while!</h2>
        <p>You will be logged out soon</p>
        <div>
          <button onClick={logOut}>Log me out</button>
          <button onClick={stayActive}>Keep me signed in</button>
        </div>
        </div> */}

      </Modal>
    </div>
  )
}

export default IdleTimerContainer