import React from 'react'

function TimerComponent({ resend }) {
    const seconds = 45;
    const [timer, setTimer] = React.useState(seconds);

    React.useEffect(() => {
        // Only set up the interval if the timer is greater than 0
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Clear the interval on component unmount or when timer reaches 0
            return () => clearInterval(interval);
        }
    }, [timer]); // Depend on the timer state to re-run effect when timer changes

    const clickHandler = () => {
        // Reset the timer to 10 seconds
        setTimer(seconds);
        // Call the resend function passed as a prop
        resend();
    };

    // console.log("Timer component")

    return (
        <button
            className='btn btn-sm btn-outline-primary'
            onClick={clickHandler}
            disabled={timer > 0}  // Disable the button when timer reaches 0
        >
            {timer === 0 ? 'Resend OTP' : `Resend in ${timer} s`}
        </button>
    );
}

export default TimerComponent;
