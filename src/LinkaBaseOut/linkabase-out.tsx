/**
 * This component Display our grid and also upload csv and export csv files.
 */


import React, { useRef } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './linkabase-out.css';
import { ILinkabaseData } from '../Interfaces/ILinkabase';

interface LinkabaseoutProps {
  linkabaseData: ILinkabaseData[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  onUpload: (data: ILinkabaseData[]) => void;
}

const Linkabaseout: React.FC<LinkabaseoutProps> = ({ linkabaseData, onDelete, onEdit, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToCSV = () => {
    const csvData = linkabaseData
      .flatMap((data) => {
        // Map over each row in step2
        return data.step2.rows.map((row) => {
          return [
            data.step1.simNumber,
            data.step1.relayType,
            data.step1.comment,
            data.step1.sorakomAccount,
            row.signalLight, 
            row.targetType,
            row.target,
            row.relay,
            row.status,
            row.comment,
          ].join(',');
        });
      })
      .join('\n');
  
    const csvHeader = 'simNumber,relayType,comment,sorakomAccount,signalLight,targetType,target,relay,status,step2Comment\n';
    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'linkabase_data.csv');
    link.click();
  };
  

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').slice(1); // Skip the header row
  
        const combinedData = rows.reduce((acc, row) => {
          const [
            simNumber,
            relayType,
            comment,
            sorakomAccount,
            signalLight,
            targetType,
            target,
            relay,
            status,
            step2Comment,
            isEnabled = 'true' // Default to 'true' if not present
          ] = row.split(',');
  
          const step1 = { simNumber, relayType, sorakomAccount, comment };
  
          // Ensure isEnabled is part of step2Row
          const step2Row = { 
            signalLight, 
            targetType, 
            target, 
            relay, 
            status, 
            comment: step2Comment,
            isEnabled: isEnabled === 'true' // Convert to boolean
          };
  
          // Check if the current simNumber already exists in the accumulated data
          const existingData = acc.find(data => data.step1.simNumber === simNumber);
  
          if (existingData) {
            // If it exists, add the new step2 row to the existing step2 rows
            existingData.step2.rows.push(step2Row);
          } else {
            // If it doesn't exist, create a new entry
            acc.push({ step1, step2: { rows: [step2Row] } });
          }
  
          return acc;
        }, [] as ILinkabaseData[]);
  
        onUpload(combinedData);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };
  
  

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="home-container">
      <div className="content">
        <button className="export-button" onClick={triggerFileInput}>
          Upload CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {linkabaseData.length === 0 ? (
          <p className="message">No Linkabase Available</p>
        ) : (
          <div className="linkabase-grid">
            <table className="table">
              <thead>
                <tr>
                  <th>SIM Number</th>
                  <th>Relay Type</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkabaseData.map((data, index) => (
                  <tr key={index}>
                    {/* Step 1 Values */}
                    <td>{data.step1.simNumber}</td>
                    <td>{data.step1.relayType}</td>
                    <td>{data.step1.comment}</td>


                    <td>
                      <button className="action-button edit-button" onClick={() => onEdit(index)}>
                        <FaEdit />
                      </button>
                      <button className="action-button delete-button" onClick={() => onDelete(index)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="export-button" onClick={exportToCSV}>
              Export to CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Linkabaseout;
