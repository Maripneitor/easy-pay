import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import OcrService, { TicketData, TicketItem } from '../../../infrastructure/services/OcrService';

export interface OCRItem {
    id?: string;
    description: string;
    amount: number;
    isUnassigned?: boolean;
}

export interface OCRScanResult {
    ticketTotal: number;
    appTotal: number;
    confidence: number;
    detectedItems: OCRItem[];
    appItems: OCRItem[];
    unassignedItems: OCRItem[];
}

const INITIAL_SCAN: OCRScanResult = {
    ticketTotal: 0,
    appTotal: 0,
    confidence: 0,
    detectedItems: [],
    appItems: [],
    unassignedItems: [],
};

export const useOCRScanner = () => {
    const [scanResult, setScanResult] = useState<OCRScanResult>(INITIAL_SCAN);
    const [isScanning, setIsScanning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = useCallback(async (file: File) => {
        if (isProcessing) return;
        
        setSelectedFile(file);
        setIsProcessing(true);
        setIsScanning(true);
        const toastId = toast.loading("Analizando ticket...");

        try {
            const data: TicketData = await OcrService.extractTicketData(file);
            
            // Mapear datos de OCR al formato de la UI
            const detectedItems: OCRItem[] = data.items.map((item, idx) => ({
                id: `ocr-${idx}`,
                description: `${item.quantity}x ${item.name}`,
                amount: item.price * item.quantity,
                isUnassigned: true
            }));

            setScanResult({
                ticketTotal: data.total,
                appTotal: 0, // Esto se llenaría comparando con el grupo actual
                confidence: 95,
                detectedItems,
                appItems: [],
                unassignedItems: detectedItems
            });
            
            toast.success("Ticket analizado con éxito", { id: toastId });

        } catch (error) {
            console.error('Error procesando ticket:', error);
            toast.error("No se pudo leer el ticket. Intenta con una imagen más clara.", { id: toastId });
        } finally {
            setIsProcessing(false);
            setIsScanning(false);
        }
    }, [isProcessing]);

    const handleSplitAll = (item: OCRItem) => {
        console.log('Dividir entre todos:', item);
        // Lógica para repartir el costo en el grupo
    };

    const handleAssignToMe = (item: OCRItem) => {
        console.log('Asignar a mí:', item);
        // Lógica para reclamar el item
    };

    const handleConfirmSync = () => {
        console.log('Confirmando y sincronizando:', scanResult);
    };

    const formatCurrency = (amount: number) =>
        `$${Number(amount).toFixed(2)}`;

    const difference = scanResult.ticketTotal - scanResult.appTotal;

    return {
        scanResult,
        isScanning,
        isProcessing,
        selectedFile,
        difference,
        handleFileUpload,
        handleSplitAll,
        handleAssignToMe,
        handleConfirmSync,
        formatCurrency,
    };
};
