import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { FaQrcode, FaDownload, FaTimes } from "react-icons/fa";

const QRCodeGenerator = ({ username }) => {
  const [showQR, setShowQR] = useState(false);
  const profileUrl = window.location.href;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showQR) {
        setShowQR(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQR]);

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
      ctx.fillStyle = "#07080a";
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
      <button
        type="button"
        onClick={() => setShowQR(true)}
        aria-label="View QR Code for this profile"
        className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#13120D] hover:bg-[#181711] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all shadow-md focus-visible:ring-2 focus-visible:ring-[#c6f035] focus-visible:outline-none"
      >
        <FaQrcode className="w-3.5 h-3.5 text-[#c6f035]" />
        <span>QR Code</span>
      </button>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c0d10] rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-white/10 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] font-mono font-medium tracking-widest text-[#c6f035] uppercase mb-1">
                    IDENTITY SCAN
                  </div>
                  <h3 id="qr-modal-title" className="text-white font-bold text-base">
                    Profile QR Code
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  aria-label="Close QR modal"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#c6f035] focus-visible:outline-none"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center mb-5">
                <div className="p-4 bg-white rounded-xl shadow-inner">
                  <QRCodeSVG
                    id="linkhub-qr-code"
                    value={profileUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#07080a"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              <p className="text-center text-xs font-mono text-zinc-400 mb-6 break-all">
                @{username}
              </p>

              <button
                type="button"
                onClick={downloadQR}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 bg-[#c6f035] text-[#07080a] rounded-xl font-bold text-xs font-mono hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <FaDownload className="w-3.5 h-3.5" />
                <span>Download PNG (512x512)</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeGenerator;

