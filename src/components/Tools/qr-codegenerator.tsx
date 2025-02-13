import { useState } from "react";
import QRCode from "qrcode";
import { Button, Input, Select, Option, Card, CardBody } from "@material-tailwind/react";
import { FaDownload } from "react-icons/fa6";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");  
  const [format, setFormat] = useState("png");  
  const [qrCodeData, setQrCodeData] = useState<string | null>(null); 

  const generateQRCode = () => {
    if (!text) return;

    QRCode.toDataURL(text, { type: format }, (err, url) => {
      if (err) {
        console.error("Erreur lors de la génération du QR code", err);
        return;
      }
      setQrCodeData(url);  
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    const link = document.createElement("a");
    link.href = qrCodeData;
    link.download = `qrcode.${format}`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full sm:w-[700px] h-auto p-6 shadow-lg"> 
        <CardBody className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
            Générateur de QR-Code
          </h1>
          <p className="mt-2 mb-6 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">
            Pour l'utiliser rien de plus simple, entrez le texte ou l'URL que vous souhaitez, choisissez le format d'image et générez !
          </p>

          <div className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-2">
            <Input
              type="text"
              label="Texte ou URL"
              value={text}
              onChange={(e) => setText(e.target.value)}  
              className="flex-1 mb-4 sm:mb-0"
            />
            <Select value={format} onChange={(value) => setFormat(value || "png")} className="mb-4 sm:mb-2">
              <Option value="png">PNG</Option>
              <Option value="jpg">JPG</Option>
              <Option value="webp">WEBP</Option>
            </Select>
            <Button color="blue" onClick={generateQRCode} fullWidth sm:m-2>
              Générer
            </Button>
          </div>
          
          {qrCodeData && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <img src={qrCodeData} alt="QR Code" className="w-full sm:w-52 h-auto max-w-[200px] sm:max-w-[300px]" />
              <Button color="blue" onClick={downloadQRCode} className="flex items-center">
                <FaDownload className="mr-2"/> Télécharger
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
