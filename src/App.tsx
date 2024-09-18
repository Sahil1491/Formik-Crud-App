import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import Linkabaseout from './LinkaBaseOut/linkabase-out';
import AddUpdateLinkabaseModal from './LinkaBaseOut/Forms/add-update-linkabase-out-form';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import linkabaseStore from './Stores/LinkabaseStore';
import { ILinkabaseData } from './Interfaces/ILinkabase';
import { observer } from 'mobx-react-lite';

const App: React.FC = observer(() => {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to keep track of the index of the item being edited
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // State to trigger re-render
  const [refresh, setRefresh] = useState(false);

  // Handler to show the modal for adding a new Linkabase item
  const handleAddLinkabaseClick = () => {
    setEditIndex(null); // Reset edit index
    setShowModal(true); // Show modal
  };

  // Handler to show the modal for editing an existing Linkabase item
  const handleEditLinkabaseClick = (index: number) => {
    setEditIndex(index); // Set the index of the item being edited
    setShowModal(true); // Show modal
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setShowModal(false); // Hide modal
  };

  // Handler to delete a Linkabase item
  const handleDelete = (index: number) => {
    linkabaseStore.deleteLinkabaseData(index); // Delete item from store
    setRefresh(!refresh); // Trigger re-render
  };

  // Handler to upload Linkabase data from a CSV file
  const handleUpload = (data: ILinkabaseData[]) => {
    data.forEach((item) => linkabaseStore.addLinkabaseData(item)); // Add each item to the store
    setRefresh(!refresh); // Trigger re-render
  };

  return (
    <>

      <Navbar onAddLinkabaseClick={handleAddLinkabaseClick} />
      <Linkabaseout
        linkabaseData={linkabaseStore.linkabaseData}
        onDelete={handleDelete}
        onEdit={handleEditLinkabaseClick}
        onUpload={handleUpload}
      />
      <AddUpdateLinkabaseModal
        show={showModal}
        handleClose={handleCloseModal}
        editIndex={editIndex}
        isEdit={editIndex !== null}
      />
    </>
  );
});

export default App;
