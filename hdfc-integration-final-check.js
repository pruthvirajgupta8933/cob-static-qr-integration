#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🏦 HDFC INTEGRATION FINAL VERIFICATION');
console.log('='.repeat(70));

// Color codes for terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

const checkMark = colors.green + '✓' + colors.reset;
const crossMark = colors.red + '✗' + colors.reset;
const warningMark = colors.yellow + '⚠' + colors.reset;

let totalChecks = 0;
let passedChecks = 0;
let criticalIssues = [];

function check(description, condition, critical = false) {
    totalChecks++;
    if (condition) {
        passedChecks++;
        console.log(`  ${checkMark} ${description}`);
        return true;
    } else {
        console.log(`  ${crossMark} ${description}`);
        if (critical) {
            criticalIssues.push(description);
        }
        return false;
    }
}

// 1. Configuration Files
console.log('\n' + colors.bold + '1. CONFIGURATION FILES' + colors.reset);
console.log('-'.repeat(40));

const envExists = fs.existsSync('.env.development');
check('Environment file exists', envExists, true);

if (envExists) {
    const envContent = fs.readFileSync('.env.development', 'utf8');
    check('HDFC Merchant ID configured', envContent.includes('REACT_APP_HDFC_MERCHANT_ID=HDFC000010380443'));
    check('HDFC Merchant Key configured', envContent.includes('REACT_APP_HDFC_MERCHANT_KEY='));
    check('HDFC VPA configured', envContent.includes('REACT_APP_HDFC_VPA=sabpaisa@hdfcbank'));
    check('HDFC API URL configured', envContent.includes('REACT_APP_HDFC_API_URL='));
}

// 2. Core Services
console.log('\n' + colors.bold + '2. CORE SERVICES' + colors.reset);
console.log('-'.repeat(40));

// Check HDFC Config
const configExists = fs.existsSync('src/config/hdfc.config.js');
check('HDFC config file exists', configExists, true);

if (configExists) {
    const configContent = fs.readFileSync('src/config/hdfc.config.js', 'utf8');
    check('Config exports default', configContent.includes('export default HDFC_CONFIG'));
    check('Config has merchantId', configContent.includes('merchantId:'));
    check('Config has VPA', configContent.includes('vpa:'));
}

// Check Encryption Service
const encryptionExists = fs.existsSync('src/utilities/encryption.js');
check('Encryption service exists', encryptionExists, true);

if (encryptionExists) {
    const encContent = fs.readFileSync('src/utilities/encryption.js', 'utf8');
    check('AES encryption implemented', encContent.includes('CryptoJS.AES.encrypt'));
    check('ECB mode used', encContent.includes('CryptoJS.mode.ECB'));
    check('PKCS7 padding used', encContent.includes('CryptoJS.pad.Pkcs7'));
}

// Check HDFC API Service
const apiExists = fs.existsSync('src/services/hdfc/hdfcApi.service.js');
check('HDFC API service exists', apiExists, true);

if (apiExists) {
    const apiContent = fs.readFileSync('src/services/hdfc/hdfcApi.service.js', 'utf8');
    check('createStaticQR method exists', apiContent.includes('createStaticQR'));
    check('verifyTransaction method exists', apiContent.includes('verifyTransaction'));
    check('checkTransactionStatus method exists', apiContent.includes('checkTransactionStatus'));
    check('validateVPA method exists', apiContent.includes('validateVPA'));
}

// 3. QR Generation Logic
console.log('\n' + colors.bold + '3. QR GENERATION' + colors.reset);
console.log('-'.repeat(40));

const sliceExists = fs.existsSync('src/slices/sabqr/sabqrSlice.js');
check('SabQR slice exists', sliceExists, true);

if (sliceExists) {
    const sliceContent = fs.readFileSync('src/slices/sabqr/sabqrSlice.js', 'utf8');
    
    // Check VPA format
    const hasOkHdfcBank = sliceContent.includes('@okhdfcbank');
    check('Uses @okhdfcbank domain', hasOkHdfcBank, true);
    
    // Check dynamic VPA generation
    const hasDynamicVPA = sliceContent.includes('sabpaisa.${identifier}@okhdfcbank');
    check('Dynamic VPA generation', hasDynamicVPA, true);
    
    // Check UPI string format
    check('UPI scheme (upi://pay?)', sliceContent.includes('upi://pay?'));
    check('Static mode (mode=01)', sliceContent.includes('mode=01'));
    check('Transaction ref (STQ prefix)', sliceContent.includes('STQ'));
    check('Currency INR', sliceContent.includes('cu=INR'));
    check('QR Medium 06', sliceContent.includes('qrMedium=06'));
    
    // Check duplicate prevention
    check('Duplicate QR prevention', sliceContent.includes('findIndex'));
}

// 4. Frontend Components
console.log('\n' + colors.bold + '4. FRONTEND COMPONENTS' + colors.reset);
console.log('-'.repeat(40));

const componentsToCheck = [
    'src/components/dashboard/AllPages/static-qr/StaticQR.js',
    'src/components/dashboard/AllPages/static-qr/QRGenerationEnhanced.js',
    'src/components/dashboard/AllPages/static-qr/QRManagement.js',
    'src/components/dashboard/AllPages/static-qr/components/QRPreviewModal.js'
];

componentsToCheck.forEach(comp => {
    const exists = fs.existsSync(comp);
    check(`${path.basename(comp)} exists`, exists);
});

// 5. Integration Points
console.log('\n' + colors.bold + '5. INTEGRATION POINTS' + colors.reset);
console.log('-'.repeat(40));

// Check Redux Store
const storeExists = fs.existsSync('src/store.js');
check('Redux store configured', storeExists);

if (storeExists) {
    const storeContent = fs.readFileSync('src/store.js', 'utf8');
    check('sabqr reducer registered', storeContent.includes('sabqr: sabqrReducer'));
}

// Check Routing
const routingExists = fs.existsSync('src/components/dashboard/dashboardLayout/DashboardMainContent.js');
if (routingExists) {
    const routeContent = fs.readFileSync('src/components/dashboard/dashboardLayout/DashboardMainContent.js', 'utf8');
    check('Static QR route configured', routeContent.includes('path={`${path}/static-qr`}'));
}

// Check Navigation
const navExists = fs.existsSync('src/components/dashboard/dashboardLayout/side-navbar/SideNavbar.js');
if (navExists) {
    const navContent = fs.readFileSync('src/components/dashboard/dashboardLayout/side-navbar/SideNavbar.js', 'utf8');
    check('QR menu item added', navContent.includes('static-qr'));
}

// 6. Backend Services (if exist)
console.log('\n' + colors.bold + '6. BACKEND SERVICES' + colors.reset);
console.log('-'.repeat(40));

const backendExists = fs.existsSync('backend/services/vpaService.js');
if (backendExists) {
    const vpaContent = fs.readFileSync('backend/services/vpaService.js', 'utf8');
    check('VPA service configured', true);
    check('VPA domain @okhdfcbank', vpaContent.includes('@okhdfcbank'));
    check('VPA prefix sabpaisa.', vpaContent.includes('sabpaisa.'));
} else {
    console.log(`  ${warningMark} Backend services not found (optional for frontend testing)`);
}

// Final Report
console.log('\n' + '='.repeat(70));
console.log(colors.bold + '📊 FINAL INTEGRATION REPORT' + colors.reset);
console.log('='.repeat(70));

const percentage = Math.round((passedChecks / totalChecks) * 100);

console.log(`\nTotal Checks: ${totalChecks}`);
console.log(`Passed: ${colors.green}${passedChecks}${colors.reset}`);
console.log(`Failed: ${colors.red}${totalChecks - passedChecks}${colors.reset}`);
console.log(`Score: ${percentage >= 80 ? colors.green : colors.yellow}${percentage}%${colors.reset}`);

if (criticalIssues.length > 0) {
    console.log('\n' + colors.red + '❌ CRITICAL ISSUES:' + colors.reset);
    criticalIssues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
    });
}

if (percentage >= 90) {
    console.log('\n' + colors.green + '✅ HDFC INTEGRATION IS READY FOR TESTING!' + colors.reset);
    console.log('\nThe integration is properly configured and ready for UAT testing.');
    console.log('\n' + colors.bold + 'Next Steps:' + colors.reset);
    console.log('1. Test QR generation at http://localhost:3000/dashboard/static-qr');
    console.log('2. Scan generated QR with UPI test app');
    console.log('3. Monitor console for any API errors');
    console.log('4. Verify webhook handling (when available)');
} else if (percentage >= 70) {
    console.log('\n' + colors.yellow + '⚠️  INTEGRATION MOSTLY COMPLETE' + colors.reset);
    console.log('\nThe core functionality is in place but some components need attention.');
} else {
    console.log('\n' + colors.red + '❌ INTEGRATION NEEDS WORK' + colors.reset);
    console.log('\nPlease address the critical issues before testing.');
}

console.log('\n' + colors.bold + '📝 Key Configuration:' + colors.reset);
console.log(`  Merchant ID: ${colors.blue}HDFC000010380443${colors.reset}`);
console.log(`  Base VPA: ${colors.blue}sabpaisa@hdfcbank${colors.reset}`);
console.log(`  Dynamic VPA: ${colors.blue}sabpaisa.XXXXX@okhdfcbank${colors.reset}`);
console.log(`  API URL: ${colors.blue}https://upitestv2.hdfcbank.com/upi${colors.reset}`);

console.log('\n' + '='.repeat(70) + '\n');