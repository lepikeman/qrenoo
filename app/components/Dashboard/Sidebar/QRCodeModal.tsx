import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose }) => {
  // Empêche la fermeture si on clique sur le contenu
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Utilitaire pour charger le logo en base64
  const getLogoBase64 = async (): Promise<string | null> => {
    try {
      const response = await fetch('/assets/logo.png');
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // Imprimer le QR code déjà généré dans la modale (solution fiable)
  const handlePrint = async () => {
    const canvas = document.querySelector(
      '.qrcode-modal-print canvas, .qrcode-modal-print svg, canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      alert("Impossible de trouver le QR code à imprimer.");
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const logoUrl = await getLogoBase64();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Imprimer QR Code</title><style>
      body { background: #f6f8f2; margin: 0; font-family: 'Segoe UI',sans-serif; }
      .qrcode-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
      .qr-logo { width: 100px; height: 100px; object-fit: contain; margin-bottom: 18px; border-radius: 14px; box-shadow: 0 1px 4px #0001; }
      .qr-title { color: #29381a; font-size: 22px; font-weight: bold; margin-bottom: 24px; }
      .qr-img { box-shadow: 0 2px 8px #0001; border-radius: 16px; background: #fff; padding: 16px; }
      .qr-url { margin-top: 18px; color: #888; font-size: 14px; word-break: break-all; text-align: center; }
    </style></head><body><div class="qrcode-container">
      ${logoUrl ? `<img src='${logoUrl}' class='qr-logo' alt='Logo' />` : ''}
      <div class="qr-title">QR Code du profil public</div>
      <img src="${dataUrl}" class="qr-img" style="width:220px;height:220px;" />
      <div class="qr-url">${url}</div>
    </div>
    <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
    </body></html>`);
    printWindow.document.close();
  };

  // Télécharger le QR code en PDF stylisé
  const handleDownloadPDF = async () => {
    const canvas = document.querySelector(
      '.qrcode-modal-print canvas, .qrcode-modal-print svg, canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      alert("Impossible de trouver le QR code à télécharger.");
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const logoUrl = await getLogoBase64();
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [340, 520] });
    pdf.setFillColor('#f6f8f2');
    pdf.rect(0, 0, 340, 520, 'F');
    if (logoUrl) {
      pdf.addImage(logoUrl, 'PNG', 120, 30, 100, 100, undefined, 'FAST');
    }
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#29381a');
    pdf.setFontSize(22);
    pdf.text('QR Code du profil public', 170, 150, { align: 'center' });
    pdf.addImage(dataUrl, 'PNG', 60, 175, 220, 220, undefined, 'FAST');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(13);
    pdf.setTextColor('#888888');
    pdf.text(url, 170, 420, { align: 'center', maxWidth: 260 });
    pdf.save('qrcode-profil-public.pdf');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="qrcode-modal-print bg-white rounded-xl p-8 shadow-lg flex flex-col items-center relative min-w-[320px]"
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#29381a]">
          QR Code du profil public
        </h2>
        <QRCodeCanvas
          value={url}
          size={220}
          fgColor="#29381a"
          bgColor="#fff"
          includeMargin={true}
        />
        <div className="mt-4 text-center break-words text-xs text-[#888]">
          {url}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            className="px-5 py-2 bg-[#29381a] text-white rounded-lg font-semibold hover:bg-[#405c26] transition"
            onClick={handlePrint}
          >
            Imprimer le QR Code
          </button>
          <button
            className="px-5 py-2 bg-[#ded9cb] text-[#29381a] rounded-lg font-semibold hover:bg-[#f6f8f2] border border-[#ded9cb] transition"
            onClick={handleDownloadPDF}
          >
            Télécharger en PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
