import { useState } from "react";
import { Button, Select, Option, Card, CardBody } from "@material-tailwind/react";
import { FaUpload } from "react-icons/fa";
import jsPDF from "jspdf";

const supportedFormats = ["jpg", "jpeg", "png", "webp", "avif", "gif", "pdf"];

export default function ImageConverter() {
  const [image, setImage] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("webp");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setUploadStatus("Image chargée avec succès");
    } else {
      setUploadStatus("Import impossible");
    }
  };

  const convertAndDownload = async () => {
    if (!image) return;
    
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const originalName = image.name.split(".").slice(0, -1).join(".");
      
      if (outputFormat === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 180, 160);
        pdf.save(`${originalName}.pdf`);
      } else {
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${originalName}.${outputFormat}`;
            link.click();
          }
        }, `image/${outputFormat}`);
      }
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Card className="w-96 p-4">
        <CardBody className="flex flex-col gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
            <FaUpload />
            <span>Choisir un fichier</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {uploadStatus && (
            <p className={`text-sm font-semibold ${uploadStatus.includes("succès") ? "text-green-500" : "text-red-500"}`}>
              {uploadStatus}
            </p>
          )}
          <Select label="Format de sortie" value={outputFormat} onChange={(value) => setOutputFormat(value || "webp")}> 
            {supportedFormats.map((format) => (
              <Option key={format} value={format}>{format.toUpperCase()}</Option>
            ))}
          </Select>
          <Button onClick={convertAndDownload} disabled={!image} color="blue">Télécharger</Button>
        </CardBody>
      </Card>
    </div>
  );
}
