import { useState } from 'react';
import type { OCRItem, OCRScanResult } from '@easy-pay/shared';

const MOCK_SCAN: OCRScanResult = {
    ticketTotal: 475.0,
    appTotal: 390.0,
    confidence: 98,
    detectedItems: [
        { id: '1', description: '2x Tacos Pastor', amount: 180.0 },
        { id: '2', description: '1x Coca-Cola Light', amount: 35.0 },
        { id: '3', description: '1x Quesadilla', amount: 65.0 },
        { id: '4', description: '1x Cerveza Modelo', amount: 45.0 },
        { id: '5', description: '1x Guacamole Extra', amount: 85.0, isUnassigned: true },
        { id: '6', description: '1x Propina (10%)', amount: 65.0 },
    ],
    appItems: [
        { description: 'Tacos + Refrescos', amount: 215.0 },
        { description: 'Quesadilla + Cerveza', amount: 110.0 },
        { description: 'Servicio', amount: 65.0 },
    ],
    unassignedItems: [
        { id: '5', description: 'Guacamole Extra', amount: 85.0, isUnassigned: true },
    ],
};

export const useOCRScanner = () => {
    const [scanResult] = useState<OCRScanResult>(MOCK_SCAN);
    const [isScanning, setIsScanning] = useState(true);
    const [flashOn, setFlashOn] = useState(false);

    const toggleFlash = () => setFlashOn((prev) => !prev);

    const handleCapture = () => {
        setIsScanning(false);
        console.log('Capture ticket');
    };

    const handleGallery = () => {
        console.log('Open gallery');
    };

    const handleCrop = () => {
        console.log('Crop mode');
    };

    const handleSplitAll = (item: OCRItem) => {
        console.log('Split among all:', item);
    };

    const handleAssignToMe = (item: OCRItem) => {
        console.log('Assign to me:', item);
    };

    const handleConfirmSync = () => {
        console.log('Confirm & sync:', scanResult);
    };

    const formatCurrency = (amount: number) =>
        amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    const difference = scanResult.ticketTotal - scanResult.appTotal;

    return {
        scanResult,
        isScanning,
        flashOn,
        difference,
        toggleFlash,
        handleCapture,
        handleGallery,
        handleCrop,
        handleSplitAll,
        handleAssignToMe,
        handleConfirmSync,
        formatCurrency,
    };
};
