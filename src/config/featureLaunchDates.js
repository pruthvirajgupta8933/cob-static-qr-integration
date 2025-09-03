/**
 * Feature Launch Date Configuration
 * Manages "NEW" badges for recently launched features
 * 
 * Badge display duration: 2 months from launch date
 * Auto-expires without code changes
 */

const featureLaunchDates = {
  // Static QR Feature
  staticQR: {
    launchDate: '2025-09-01',  // Production launch date
    displayDuration: 2,         // Months to display "NEW" badge
    featureName: 'Static QR',
    description: 'Generate and manage HDFC UPI QR codes'
  },
  
  // Bulk QR Feature
  bulkQR: {
    launchDate: '2025-09-03',  // Production launch date
    displayDuration: 2,         // Months to display "NEW" badge
    featureName: 'Bulk QR Generator',
    description: 'Generate multiple QR codes via CSV upload'
  },
  
  // Add future features here
  // Example:
  // dynamicQR: {
  //   launchDate: '2025-10-01',
  //   displayDuration: 2,
  //   featureName: 'Dynamic QR',
  //   description: 'Dynamic amount QR codes'
  // }
};

/**
 * Check if a feature should display the "NEW" badge
 * @param {string} featureKey - Key from featureLaunchDates object
 * @returns {boolean} - Whether to show the NEW badge
 */
export const shouldShowNewBadge = (featureKey) => {
  const feature = featureLaunchDates[featureKey];
  
  if (!feature) return false;
  
  const launchDate = new Date(feature.launchDate);
  const expiryDate = new Date(launchDate);
  expiryDate.setMonth(expiryDate.getMonth() + feature.displayDuration);
  
  const now = new Date();
  
  return now >= launchDate && now < expiryDate;
};

/**
 * Get days remaining for NEW badge
 * @param {string} featureKey - Key from featureLaunchDates object
 * @returns {number} - Days remaining (0 if expired)
 */
export const getDaysRemaining = (featureKey) => {
  const feature = featureLaunchDates[featureKey];
  
  if (!feature) return 0;
  
  const launchDate = new Date(feature.launchDate);
  const expiryDate = new Date(launchDate);
  expiryDate.setMonth(expiryDate.getMonth() + feature.displayDuration);
  
  const now = new Date();
  
  if (now >= expiryDate) return 0;
  
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  return daysRemaining;
};

/**
 * Get all active NEW features
 * @returns {Array} - Array of active feature keys
 */
export const getActiveNewFeatures = () => {
  return Object.keys(featureLaunchDates).filter(key => shouldShowNewBadge(key));
};

export default featureLaunchDates;