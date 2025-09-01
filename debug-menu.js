// Debug script to check menu state
console.log('\n🔍 Debugging Menu and Dashboard Issues\n');

// Check Redux DevTools
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log('✓ Redux DevTools available - check state there');
} else {
  console.log('✗ Redux DevTools not available');
}

// Check localStorage
const user = localStorage.getItem('user');
if (user) {
  const userData = JSON.parse(user);
  console.log('✓ User data in localStorage:', userData.loginId);
} else {
  console.log('✗ No user data in localStorage');
}

// Check session storage
const token = sessionStorage.getItem('token');
console.log(token ? '✓ Token exists' : '✗ No token in session');

// Try to access Redux store directly
if (window.store) {
  const state = window.store.getState();
  console.log('Redux State:', {
    menuList: state.menuListReducer,
    auth: state.auth?.user?.loginId,
    dashboard: state.dashboard
  });
}

console.log('\nTo debug further:');
console.log('1. Open Redux DevTools and check menuListReducer state');
console.log('2. Check Network tab for API calls to menu endpoints');
console.log('3. Look for any 401/403 errors indicating auth issues');
