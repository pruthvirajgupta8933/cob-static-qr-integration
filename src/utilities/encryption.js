import CryptoJS from 'crypto-js';
import HDFC_CONFIG from '../config/hdfc.config';
import VPAGenerator from './vpaGenerator';

class EncryptionService {
    constructor() {
        // Use centralized configuration
        this.merchantKey = HDFC_CONFIG.merchantKey;
        this.merchantId = HDFC_CONFIG.merchantId;
        this.vpa = HDFC_CONFIG.vpa;
    }

    // AES128 encryption for HDFC API
    encryptAES128(plainText, key) {
        try {
            const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
            const encrypted = CryptoJS.AES.encrypt(plainText, keyUtf8, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    }

    // AES128 decryption for HDFC API responses
    decryptAES128(encryptedText, key) {
        try {
            const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
            const decrypted = CryptoJS.AES.decrypt(encryptedText, keyUtf8, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    }

    // Generate UPI QR string for Static QR
    generateStaticQRString(params) {
        const {
            identifier,
            merchantName = 'SRS Live Technologies',
            merchantId = HDFC_CONFIG.MERCHANT_ID,
            mcc = '6012', // Use 6012 for UAT as per HDFC email
            amount = '',
            description = ''
        } = params;

        // Generate unique transaction reference with STQ prefix (HDFC requirement)
        const transactionRef = `STQ${identifier}${Date.now()}`;
        
        // Generate merchant-specific VPA to prevent collisions
        // Uses merchant prefix (first 3 chars of company name) + identifier
        const dynamicVPA = VPAGenerator.generateUniqueVPA({
            identifier: identifier?.toLowerCase() || 'default',
            merchantName: merchantName,
            merchantId: merchantId,
            strategy: 'prefix'
        });
        
        // Build UPI string as per HDFC UAT format from email
        const upiString = [
            'upi://pay?',
            `pa=${dynamicVPA}`, // Dynamic VPA as per HDFC
            `&pn=${encodeURIComponent(merchantName)}`,
            `&tn=${encodeURIComponent(description || 'TestQR')}`,
            '&cu=INR',
            `&mc=${mcc}`, // 6012 for UAT
            `&tr=${transactionRef}`, // Must start with STQ
            '&mode=01', // Static QR mode (01 not 01S)
            '&qrMedium=06'
        ].join('');

        console.log('Generated QR String for HDFC UAT:', upiString);
        return { upiString, transactionRef, vpa: dynamicVPA };
    }

    // Generate UPI QR string for Dynamic QR
    generateDynamicQRString(params) {
        const {
            orderId,
            amount,
            merchantName = 'SRS Live Technologies',
            mcc = '5499',
            description = ''
        } = params;

        // Generate unique transaction reference
        const transactionRef = `DYN${orderId}${Date.now()}`;
        
        // Build UPI string for dynamic QR
        const upiString = [
            'upi://pay?',
            'ver=01',
            '&mode=15', // Dynamic QR mode
            `&tr=${transactionRef}`,
            `&tn=${encodeURIComponent(description || '')}`,
            `&pn=${encodeURIComponent(merchantName)}`,
            `&pa=${this.vpa}`,
            `&mc=${mcc}`,
            `&am=${amount}`, // Amount is mandatory for dynamic QR
            '&cu=INR',
            '&qrMedium=06'
        ].join('');

        return { upiString, transactionRef };
    }

    // Parse HDFC callback response (21 pipe-separated fields)
    parseCallbackResponse(encryptedResponse) {
        try {
            const decrypted = this.decryptAES128(encryptedResponse, this.merchantKey);
            const fields = decrypted.split('|');
            
            return {
                merchantId: fields[0],
                merchantName: fields[1],
                terminalId: fields[2],
                transactionId: fields[3],
                bankRRN: fields[4],
                merchantTxnId: fields[5],
                amount: parseFloat(fields[6]),
                transactionStatus: fields[7], // SUCCESS/FAILURE
                statusDescription: fields[8],
                payerVPA: fields[9],
                payerName: fields[10],
                mobileNumber: fields[11],
                transactionDateTime: fields[12],
                settlementAmount: parseFloat(fields[13]),
                settlementDateTime: fields[14],
                paymentMode: fields[15],
                mcc: fields[16],
                tipAmount: parseFloat(fields[17]) || 0,
                convenienceFee: parseFloat(fields[18]) || 0,
                netAmount: parseFloat(fields[19]),
                checksum: fields[20]
            };
        } catch (error) {
            console.error('Failed to parse callback response:', error);
            throw new Error('Invalid callback response format');
        }
    }

    // Generate checksum for API requests
    generateChecksum(data) {
        const dataString = Object.values(data).join('|');
        return CryptoJS.SHA256(dataString + this.merchantKey).toString();
    }

    // Validate checksum from API responses
    validateChecksum(data, receivedChecksum) {
        const calculatedChecksum = this.generateChecksum(data);
        return calculatedChecksum === receivedChecksum;
    }
}

export default new EncryptionService();