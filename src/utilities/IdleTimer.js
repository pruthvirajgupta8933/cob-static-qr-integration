import React, { useState, useRef, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
// import Modal from 'react-modal';
import { useDispatch } from "react-redux";
import { logout } from "../slices/auth";
import { TIMEOUT } from "../config";
import moment from "moment";
import CustomModal from "../_components/custom_modal";
import toastConfig from "./toastTypes";
// import { Modal } from 'bootstrap';

// Set the app element for Modal (for accessibility)
// Modal.setAppElement('#root');

function IdleTimerContainer() {
  const dispatch = useDispatch();
  // const { fnLogout } = props;
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const idleTimerRef = useRef(null);
  // const sessionTimeoutRef = useRef(null);

  const timeout = TIMEOUT;
  const [remaining, setRemaining] = useState(timeout);
  const [elapsed, setElapsed] = useState(0);
  const [lastActive, setLastActive] = useState(+new Date());
  const [isIdle, setIsIdle] = useState(false);

  const handleOnActive = () => setIsIdle(false);
  const handleOnIdle = () => setIsIdle(true);

  const {
    reset,
    pause,
    resume,
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime,
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
  });

  const handleReset = () => reset();
  const handlePause = () => pause();
  const handleResume = () => resume();

  useEffect(() => {
    setRemaining(getRemainingTime());
    setLastActive(getLastActiveTime());
    setElapsed(getElapsedTime());

    setInterval(() => {
      setRemaining(getRemainingTime());
      setLastActive(getLastActiveTime());
      setElapsed(getElapsedTime());
    }, 1000);
  }, []);

;

  // Perform logout action
  const logOut = () => {
    // setModalIsOpen(false);
    // setIsLoggedIn(false);
    // fnLogout(false);
    dispatch(logout());
    // clearTimeout(sessionTimeoutRef.current);
  };

  // Set expired time in localStorage and clean up when necessary
  useEffect(() => {
    if (isIdle) {
      logOut();
     toastConfig.errorToast("Session Expired, You have been logged out due to inactivity.");
    }

  }, [isIdle]);


const modalBody = () => (
    <div className="text-danger">
      <p className="m-0">You have been idle for a while!</p>
      <p>You will be logged out soon</p>
      <div className="d-flex justify-content-between">
      {/* <button type="button" className="btn btn-danger btn-sm" onClick={logOut}>Log me out</button>
      <button type="button" className="btn cob-btn-primary btn-sm" onClick={stayActive}>Keep me signed in</button> */}
      </div>

    </div>
  );



  return (
    <div>

      <CustomModal modalBody={modalBody} headerTitle={"Session Timeout Warning"} modalToggle={isIdle}
        fnSetModalToggle={setIsIdle}  />

{/* 
      <div>
        <h1>Timeout: {timeout}ms</h1>
        <h1>Time Remaining: {remaining}</h1>
        <h1>Time Elapsed: {elapsed}</h1>
        <h1>
          Last Active: {moment(lastActive).format("MM-DD-YYYY HH:mm:ss.SSS")}
        </h1>
        <h1>Idle: {isIdle.toString()}</h1>
      </div>
      <div>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handlePause}>PAUSE</button>
        <button onClick={handleResume}>RESUME</button>
      </div> */}
    </div>
  );
}

export default IdleTimerContainer;
