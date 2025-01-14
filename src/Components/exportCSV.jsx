import React from 'react';
import Papa from 'papaparse';

  const downloadCSV = (promoObj) => {
    // Convert JSON to CSV
    const csv = Papa.unparse(promoObj);


    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "data.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  export default downloadCSV



