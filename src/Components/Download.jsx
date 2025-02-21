import { useState } from "react";
import { Button } from "antd";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
// import docx2html from "docx2html"

export default function DocumentTemplater() {
  // const [name, setName] = useState("Results");
  // const [date, setDate] = useState(new Date().toLocaleDateString());

  // const data = {name: "Kobe", lastname: "Balansag", address: {street: "pulantubig", city: "Duma"}}

  // function flattenObject(obj, prefix = "") {
  //   return Object.keys(obj).reduce((acc, key) => {
  //     const prop = prefix ? `${prefix}_${key}` : key;
  //     if (typeof obj[key] === "object" && obj[key] !== null) {
  //       Object.assign(acc, flattenObject(obj[key], prop));
  //     } else {
  //       acc[prop] = obj[key];
  //     }
  //     return acc;
  //   }, {});
  // }

  // const flattenedData = flattenObject(data)

  // console.log(flattenedData)

  // const handleDownloadDOCX = async () => {
  //   try {
     
  //     const response = await fetch("/template.docx");
  //     if (!response.ok) throw new Error("Failed to load template");

  //     const arrayBuffer = await response.arrayBuffer();
  //     const zip = new PizZip(arrayBuffer);
  //     const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: {start:"{{", end:"}}"}});
  //     console.log(doc)
  //     doc.setData(flattenedData );

  //     doc.render();

  //     const outputBlob = new Blob([doc.getZip().generate({ type: "blob" })], {
  //       type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     });


  //     saveAs(outputBlob, `${name}.docx`);
  //   } catch (error) {
  //     console.error("❌ Error generating document:", error);
  //     alert("Error: " + error.message);
  //   }
  // };

  const DownloadDocx = () => {
    const handleDownload = async () => {
      try {
        const response = await fetch("http://localhost:8000/convert");
  
        if (!response.ok) {
          throw new Error("Failed to fetch document");
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create a link and trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.pdf"; // Set filename
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    return <button onClick={handleDownload}>Download DOCX</button>;
  }
  return (
    <div className="flex flex-col items-center p-4 gap-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">DOCX Templater</h1>
      {/* <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter filename"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Enter Date"
        className="p-2 border rounded w-full"
      />
      <Button onClick={handleDownloadDOCX} type="primary">
        Download DOCX
      </Button> */}
      {DownloadDocx()}
    </div>
  );
}
