import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import VPAGenerator from '../../../../../utilities/vpaGenerator';
import './QRTemplateDesign.css';

const QRTemplateDesign = ({ 
    qrData, 
    merchantName = 'Merchant', 
    reference = '',
    amount = null,
    identifier = '',
    onCanvasReady = null 
}) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        if (canvasRef.current && (qrData || identifier)) {
            generateBrandedQR();
        }
    }, [qrData, identifier, reference, amount]);
    
    const generateBrandedQR = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for high quality
        canvas.width = 1200;
        canvas.height = 1600;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Top header with SabPaisa branding
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 200);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(1, '#2a5298');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 200);
        
        // SabPaisa Logo/Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SabPaisa', canvas.width / 2, 100);
        
        ctx.font = '36px Arial';
        ctx.fillText('Secure Payment Gateway', canvas.width / 2, 150);
        
        // Merchant Name Section
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 200, canvas.width, 150);
        
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(merchantName, canvas.width / 2, 290);
        
        // Reference name if provided
        if (reference) {
            ctx.font = '32px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText(reference, canvas.width / 2, 330);
        }
        
        // QR Code Section
        const qrSize = 600;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 400;
        
        // QR Code border
        ctx.strokeStyle = '#1e3c72';
        ctx.lineWidth = 8;
        ctx.strokeRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
        
        // Generate QR Code
        let upiString = qrData;
        if (!qrData && identifier) {
            // Generate UPI string for preview with merchant-specific VPA
            const dynamicVPA = VPAGenerator.generateUniqueVPA({
                identifier: identifier.toLowerCase(),
                merchantName: merchantName || 'SRS Live Technologies',
                strategy: 'prefix'
            });
            upiString = `upi://pay?ver=01&mode=01&pa=${dynamicVPA}&pn=${encodeURIComponent(merchantName)}&mc=5499&cu=INR&qrMedium=06`;
            if (amount) {
                upiString += `&am=${amount}`;
            }
        }
        
        if (upiString) {
            try {
                const qrCanvas = document.createElement('canvas');
                await QRCode.toCanvas(qrCanvas, upiString, {
                    width: qrSize,
                    margin: 0,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });
                ctx.drawImage(qrCanvas, qrX, qrY);
            } catch (error) {
                console.error('Error generating QR:', error);
                // Placeholder for QR
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(qrX, qrY, qrSize, qrSize);
                ctx.fillStyle = '#999999';
                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('QR Code', canvas.width / 2, qrY + qrSize / 2);
            }
        }
        
        // Scan instruction
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO PAY', canvas.width / 2, qrY + qrSize + 80);
        
        // Amount display (if fixed)
        if (amount) {
            ctx.fillStyle = '#1e3c72';
            ctx.font = 'bold 64px Arial';
            ctx.fillText(`₹ ${amount}`, canvas.width / 2, qrY + qrSize + 160);
        } else {
            ctx.fillStyle = '#666666';
            ctx.font = '36px Arial';
            ctx.fillText('Enter Amount in UPI App', canvas.width / 2, qrY + qrSize + 160);
        }
        
        // VPA Display
        if (identifier) {
            const vpa = VPAGenerator.generateUniqueVPA({
                identifier: identifier.toLowerCase(),
                merchantName: merchantName || 'SRS Live Technologies',
                strategy: 'prefix'
            });
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(100, qrY + qrSize + 200, canvas.width - 200, 80);
            
            ctx.fillStyle = '#333333';
            ctx.font = '32px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`VPA: ${vpa}`, canvas.width / 2, qrY + qrSize + 250);
        }
        
        // UPI Apps section
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
        
        ctx.fillStyle = '#666666';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Pay using any UPI App', canvas.width / 2, canvas.height - 140);
        
        // Draw UPI app logos (text representation)
        const apps = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'];
        const appWidth = canvas.width / apps.length;
        ctx.font = '24px Arial';
        ctx.fillStyle = '#999999';
        apps.forEach((app, index) => {
            ctx.fillText(app, (index + 0.5) * appWidth, canvas.height - 80);
        });
        
        // Footer
        ctx.fillStyle = '#1e3c72';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Powered by SabPaisa - India\'s Leading Payment Platform', canvas.width / 2, canvas.height - 15);
        
        // Notify parent component
        if (onCanvasReady) {
            onCanvasReady(canvas);
        }
    };
    
    return (
        <div className="qr-template-container">
            <canvas 
                ref={canvasRef}
                className="qr-template-canvas"
                style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
};

export default QRTemplateDesign;