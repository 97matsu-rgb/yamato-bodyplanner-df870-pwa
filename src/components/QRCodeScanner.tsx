import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export const QRCodeScanner = ({ onScan, onClose }: { onScan: (text: string) => void; onClose: () => void }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 240, height: 240 }, rememberLastUsedCamera: true },
      false,
    );
    scanner.render(
      async (decodedText) => {
        await scanner.clear();
        onScan(decodedText);
      },
      () => undefined,
    );
    return () => {
      scanner.clear().catch(() => undefined);
    };
  }, [onScan]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="card-title-row">
          <h2>QRコード読み取り</h2>
          <button className="ghost-button" onClick={onClose}>閉じる</button>
        </div>
        <div id="qr-reader" />
        <p className="muted">iPhone / Android ではカメラ権限を許可してください。</p>
      </div>
    </div>
  );
};
