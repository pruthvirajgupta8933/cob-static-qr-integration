import { useEffect } from 'react';

const useGoogleLogout = (onLogout) => {
  useEffect(() => {
    const logout = () => {
      console.log('User logged out successfully.');
      // Call the provided logout function
      onLogout();
    };

    // Perform any necessary cleanup or logout logic when the component unmounts
    return () => {
      logout();
    };
  }, [onLogout]);
};

export default useGoogleLogout;
