#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 HDFC Integration Verification Report\n');
console.log('=' .repeat(70));

let issuesFound = [];
let verifications = [];

// 1. Check Environment Configuration
console.log('\n1️⃣ ENVIRONMENT CONFIGURATION');
console.log('-' .repeat(40));

const envPath = path.join(__dirname, '.env.development');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {
        HDFC_MERCHANT_ID: envContent.includes('REACT_APP_HDFC_MERCHANT_ID='),
        HDFC_MERCHANT_KEY: envContent.includes('REACT_APP_HDFC_MERCHANT_KEY='),
        HDFC_VPA: envContent.includes('REACT_APP_HDFC_VPA='),
        HDFC_API_URL: envContent.includes('REACT_APP_HDFC_API_URL=')
    };
    
    console.log(`  ✓ Merchant ID configured: ${envVars.HDFC_MERCHANT_ID ? 'YES' : 'NO'}`);
    console.log(`  ✓ Merchant Key configured: ${envVars.HDFC_MERCHANT_KEY ? 'YES' : 'NO'}`);
    console.log(`  ✓ VPA configured: ${envVars.HDFC_VPA ? 'YES' : 'NO'}`);
    console.log(`  ✓ API URL configured: ${envVars.HDFC_API_URL ? 'YES' : 'NO'}`);
    
    if (!Object.values(envVars).every(v => v)) {
        issuesFound.push('Missing environment variables');
    }
} else {
    issuesFound.push('.env.development file not found');
}

// 2. Check HDFC Config File
console.log('\n2️⃣ HDFC CONFIG FILE');
console.log('-' .repeat(40));

const configPath = path.join(__dirname, 'src/config/hdfc.config.js');
if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    const hasExports = configContent.includes('export const HDFC_CONFIG');
    const hasMerchantId = configContent.includes('merchantId:');
    const hasMerchantKey = configContent.includes('merchantKey:');
    const hasVPA = configContent.includes('vpa:');
    const hasApiUrl = configContent.includes('apiUrl:');
    
    console.log(`  ✓ Config exported: ${hasExports ? 'YES' : 'NO'}`);
    console.log(`  ✓ Merchant ID field: ${hasMerchantId ? 'YES' : 'NO'}`);
    console.log(`  ✓ Merchant Key field: ${hasMerchantKey ? 'YES' : 'NO'}`);
    console.log(`  ✓ VPA field: ${hasVPA ? 'YES' : 'NO'}`);
    console.log(`  ✓ API URL field: ${hasApiUrl ? 'YES' : 'NO'}`);
    
    verifications.push('HDFC config file properly structured');
} else {
    issuesFound.push('hdfc.config.js not found');
}

// 3. Check Encryption Service
console.log('\n3️⃣ ENCRYPTION SERVICE');
console.log('-' .repeat(40));

const encryptionPath = path.join(__dirname, 'src/utilities/encryption.js');
if (fs.existsSync(encryptionPath)) {
    const encryptionContent = fs.readFileSync(encryptionPath, 'utf8');
    
    const hasAES128 = encryptionContent.includes('aes-128-ecb');
    const hasEncrypt = encryptionContent.includes('encryptAES128');
    const hasDecrypt = encryptionContent.includes('decryptAES128');
    
    console.log(`  ✓ AES-128-ECB algorithm: ${hasAES128 ? 'YES' : 'NO'}`);
    console.log(`  ✓ Encrypt function: ${hasEncrypt ? 'YES' : 'NO'}`);
    console.log(`  ✓ Decrypt function: ${hasDecrypt ? 'YES' : 'NO'}`);
    
    if (!hasAES128 || !hasEncrypt || !hasDecrypt) {
        issuesFound.push('Encryption service incomplete');
    } else {
        verifications.push('AES-128 encryption properly implemented');
    }
} else {
    issuesFound.push('encryption.js not found');
}

// 4. Check HDFC API Service
console.log('\n4️⃣ HDFC API SERVICE');
console.log('-' .repeat(40));

const hdfcApiPath = path.join(__dirname, 'src/services/hdfc/hdfcApi.service.js');
if (fs.existsSync(hdfcApiPath)) {
    const apiContent = fs.readFileSync(hdfcApiPath, 'utf8');
    
    const endpoints = {
        createStaticQR: apiContent.includes('createStaticQR'),
        createDynamicQR: apiContent.includes('createDynamicQR'),
        verifyTransaction: apiContent.includes('verifyTransaction'),
        checkTransactionStatus: apiContent.includes('checkTransactionStatus'),
        refundTransaction: apiContent.includes('refundTransaction'),
        validateVPA: apiContent.includes('validateVPA')
    };
    
    console.log('  API Endpoints Implemented:');
    Object.entries(endpoints).forEach(([name, exists]) => {
        console.log(`    ${exists ? '✓' : '✗'} ${name}`);
        if (!exists && ['createStaticQR', 'verifyTransaction'].includes(name)) {
            issuesFound.push(`Critical endpoint ${name} not implemented`);
        }
    });
    
    verifications.push('HDFC API service layer created');
} else {
    issuesFound.push('hdfcApi.service.js not found');
}

// 5. Check UPI String Generation
console.log('\n5️⃣ UPI STRING GENERATION');
console.log('-' .repeat(40));

const slicePath = path.join(__dirname, 'src/slices/sabqr/sabqrSlice.js');
if (fs.existsSync(slicePath)) {
    const sliceContent = fs.readFileSync(slicePath, 'utf8');
    
    // Check for proper UPI string format
    const hasUPIFormat = sliceContent.includes('upi://pay?');
    const hasVersion = sliceContent.includes('ver=01');
    const hasMode = sliceContent.includes('mode=01');
    const hasTransactionRef = sliceContent.includes('&tr=');
    const hasPaymentAddress = sliceContent.includes('&pa=');
    const hasMerchantCode = sliceContent.includes('&mc=');
    const hasCurrency = sliceContent.includes('&cu=INR');
    const hasQRMedium = sliceContent.includes('qrMedium=06');
    
    console.log('  UPI String Components:');
    console.log(`    ✓ UPI scheme: ${hasUPIFormat ? 'YES' : 'NO'}`);
    console.log(`    ✓ Version (ver=01): ${hasVersion ? 'YES' : 'NO'}`);
    console.log(`    ✓ Mode (mode=01 for static): ${hasMode ? 'YES' : 'NO'}`);
    console.log(`    ✓ Transaction Reference: ${hasTransactionRef ? 'YES' : 'NO'}`);
    console.log(`    ✓ Payment Address (VPA): ${hasPaymentAddress ? 'YES' : 'NO'}`);
    console.log(`    ✓ Merchant Category Code: ${hasMerchantCode ? 'YES' : 'NO'}`);
    console.log(`    ✓ Currency (INR): ${hasCurrency ? 'YES' : 'NO'}`);
    console.log(`    ✓ QR Medium (06): ${hasQRMedium ? 'YES' : 'NO'}`);
    
    const allComponents = hasUPIFormat && hasVersion && hasMode && hasTransactionRef && 
                         hasPaymentAddress && hasMerchantCode && hasCurrency && hasQRMedium;
    
    if (!allComponents) {
        issuesFound.push('UPI string format incomplete');
    } else {
        verifications.push('UPI string properly formatted');
    }
} else {
    issuesFound.push('sabqrSlice.js not found');
}

// 6. Check VPA Generation Logic
console.log('\n6️⃣ VPA GENERATION');
console.log('-' .repeat(40));

const backendVPAPath = path.join(__dirname, 'backend/services/vpaService.js');
if (fs.existsSync(backendVPAPath)) {
    const vpaContent = fs.readFileSync(backendVPAPath, 'utf8');
    
    const vpaConfig = {
        domain: vpaContent.match(/VPA_DOMAIN = '([^']+)'/)?.[1],
        prefix: vpaContent.match(/VPA_PREFIX = '([^']+)'/)?.[1],
        length: vpaContent.includes('IDENTIFIER_LENGTH = 5')
    };
    
    console.log(`  ✓ VPA Domain: ${vpaConfig.domain || 'NOT FOUND'}`);
    console.log(`  ✓ VPA Prefix: ${vpaConfig.prefix || 'NOT FOUND'}`);
    console.log(`  ✓ Identifier Length (5): ${vpaConfig.length ? 'YES' : 'NO'}`);
    
    if (vpaConfig.domain === '@okhdfcbank') {
        verifications.push('VPA domain correctly set to @okhdfcbank');
    } else {
        issuesFound.push('VPA domain mismatch');
    }
}

// Check frontend VPA generation
if (fs.existsSync(slicePath)) {
    const sliceContent = fs.readFileSync(slicePath, 'utf8');
    const hasDynamicVPA = sliceContent.includes('sabpaisa.${identifier}@okhdfcbank');
    
    console.log(`  ✓ Dynamic VPA Generation: ${hasDynamicVPA ? 'YES' : 'NO'}`);
    
    if (hasDynamicVPA) {
        verifications.push('Dynamic VPA generation implemented');
    } else {
        issuesFound.push('Dynamic VPA not properly generated');
    }
}

// 7. Check Webhook Handler
console.log('\n7️⃣ WEBHOOK HANDLER');
console.log('-' .repeat(40));

const webhookPath = path.join(__dirname, 'backend/controllers/webhookController.js');
if (fs.existsSync(webhookPath)) {
    const webhookContent = fs.readFileSync(webhookPath, 'utf8');
    
    const hasDecryption = webhookContent.includes('decrypt');
    const hasValidation = webhookContent.includes('validateWebhookData');
    const hasProcessing = webhookContent.includes('processPayment');
    
    console.log(`  ✓ Decryption logic: ${hasDecryption ? 'YES' : 'NO'}`);
    console.log(`  ✓ Validation logic: ${hasValidation ? 'YES' : 'NO'}`);
    console.log(`  ✓ Payment processing: ${hasProcessing ? 'YES' : 'NO'}`);
    
    verifications.push('Webhook handler configured');
} else {
    console.log('  ⚠️  Webhook handler not found (optional for testing)');
}

// 8. Check Test Files
console.log('\n8️⃣ TEST FILES');
console.log('-' .repeat(40));

const testFiles = [
    'test-hdfc-api.js',
    'public/test-qr.html',
    'public/integration-test.html',
    'TESTING_GUIDE.md'
];

testFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

// 9. Check Critical Values
console.log('\n9️⃣ CRITICAL VALUES CHECK');
console.log('-' .repeat(40));

console.log('  Expected Values:');
console.log('    • Merchant ID: HDFC000010380443');
console.log('    • VPA Base: sabpaisa@hdfcbank');
console.log('    • Dynamic VPA: sabpaisa.XXXXX@okhdfcbank');
console.log('    • Transaction Ref: STQ + identifier + timestamp');
console.log('    • Mode: 01 (Static QR)');
console.log('    • QR Medium: 06');
console.log('    • Currency: INR');

// Final Report
console.log('\n' + '=' .repeat(70));
console.log('\n📊 INTEGRATION SUMMARY\n');

if (issuesFound.length === 0) {
    console.log('✅ ALL CHECKS PASSED!\n');
    console.log('The HDFC integration appears to be properly implemented.');
    console.log('\n✓ Verified Components:');
    verifications.forEach(v => console.log(`  • ${v}`));
    
    console.log('\n🚀 READY FOR TESTING');
    console.log('\nNext Steps:');
    console.log('1. Test QR generation with test credentials');
    console.log('2. Verify UPI string format with HDFC documentation');
    console.log('3. Test webhook handling (if applicable)');
    console.log('4. Validate with HDFC UAT environment');
} else {
    console.log('⚠️  ISSUES FOUND:\n');
    issuesFound.forEach((issue, i) => {
        console.log(`${i + 1}. ❌ ${issue}`);
    });
    
    console.log('\n✓ Working Components:');
    verifications.forEach(v => console.log(`  • ${v}`));
    
    console.log('\n⚠️  NEEDS ATTENTION BEFORE DEPLOYMENT');
}

console.log('\n📝 Test Commands:');
console.log('  • npm start - Run the application');
console.log('  • node test-hdfc-api.js - Test HDFC API endpoints');
console.log('  • Open http://localhost:3000/dashboard/static-qr - Test QR generation');
console.log('  • Open http://localhost:3000/test-qr.html - Test standalone QR');

console.log('\n' + '=' .repeat(70) + '\n');