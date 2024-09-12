// ListMaintenance.tsx
// Maintenance.tsx
// DeleteConfirmationAlert.tsx

import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonToolbar, IonTitle } from '@ionic/react';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { dataFire } from '../pages/FirebaseConfig';

interface AddMaintainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaintainerAdded: () => void; // New prop to notify parent when a new maintainer is added
}

const AddMaintainerModal: React.FC<AddMaintainerModalProps> = ({ isOpen, onClose, onMaintainerAdded }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');

  const handleAddMaintainer = async () => {
    if (!name || !phone || !specialty) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Add new maintainer to Firestore
      await addDoc(collection(dataFire, 'maintenance'), {
        Name: name,
        Phone: phone,
        Specialty: specialty,
      });

      alert('Maintainer added successfully');
      setName('');
      setPhone('');
      setSpecialty('');
      onClose(); // Close the modal after adding
      onMaintainerAdded(); // Call the callback to notify parent
    } catch (error) {
      console.error('Error adding maintainer:', error);
      alert('Failed to add maintainer');
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Add New Maintainer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'} className="ion-padding">
        <IonItem color={'dark'}>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} placeholder="Enter name" />
        </IonItem>
        <IonItem color={'dark'}>
          <IonLabel position="stacked">Phone</IonLabel>
          <IonInput value={phone} onIonChange={(e) => setPhone(e.detail.value!)} placeholder="Enter phone number" />
        </IonItem>
        <IonItem color={'dark'}>
          <IonLabel position="stacked">Specialty</IonLabel>
          <IonInput value={specialty} onIonChange={(e) => setSpecialty(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleAddMaintainer}>
          Add Maintainer
        </IonButton>
        <IonButton expand="block" color={'danger'} onClick={onClose}>
          Cancel
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default AddMaintainerModal;
