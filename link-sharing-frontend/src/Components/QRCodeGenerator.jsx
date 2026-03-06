import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { FaQrcode, FaDownload, FaTimes } from "react-icons/fa";

const QRCodeGenerator = ({ username }) => {
  const [showQR, setShowQR] = useState(false);
  const profileUrl = `${window.location.origin}/${username}`;

  const downloadQR = () => {
    const svg = document.getElementById("linkhub-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 56, 56, 400, 400);
      const link = document.createElement("a");
      link.download = `linkhub-${username}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(true)}
        className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
        title="QR Code"
      >
        <FaQrcode className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-8 max-w-sm w-full border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">QR Code</h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-2xl">
                  <QRCodeSVG
                    id="linkhub-qr-code"
                    value={profileUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#0a0a0a"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              <p className="text-center text-white/40 text-sm mb-6">
                Scan to visit{" "}
                <span className="text-purple-400">
                  linkhub.com/{username}
                </span>
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <FaDownload className="w-4 h-4" />
                Download QR Code
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeGenerator;
