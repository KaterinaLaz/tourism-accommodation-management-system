// AddMaintainerModal.tsx
// ListMaintenance.tsx
// DeleteConfirmationAlert.tsx

import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { dataFire } from './FirebaseConfig';
import './Maintenance.css'
import { text } from 'ionicons/icons';

const Maintenance: React.FC = () => {
    const [problemDescription, setProblemDescription] = useState<string>(''); 
    const [selectedMaintainer, setSelectedMaintainer] = useState<string>(''); 
    const [location, setLocation] = useState<string>(''); 
    const [maintainers, setMaintainers] = useState<any[]>([]); 
  
    const sendEmailNotification = async (email: string, subject: string, text: string) => {
      try {
        const response = await fetch('https://your-cloud-function-url/sendEmailNotification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: 'Maintenance Request',
            text: `You have a new maintenance request at ${location}: ${problemDescription}`,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
    
        const result = await response.json();
        console.log('Email sent:', result);
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Error sending email notification');
      }
    };
    useEffect(() => {
      const fetchMaintainers = async () => {
        const querySnapshot = await getDocs(collection(dataFire, 'maintenance')); 
        const maintainersList = querySnapshot.docs.map((doc: { id: any; data: () => any; }) => ({
          id: doc.id,
          ...doc.data()
        }));
       
        setMaintainers(maintainersList); 
      };
  
      fetchMaintainers();
    }, []);

    const handleSubmit = async () => {
      if (!problemDescription || !selectedMaintainer || !location) {
        alert('Please fill in all fields');
        return;
      }
    
      try {
        // Fetch selected maintainer's email from Firestore
        const maintainerDoc = maintainers.find((maintainer) => maintainer.id === selectedMaintainer);
    
        if (!maintainerDoc) {
          alert('Maintainer not found');
          return;
        }
    
        const maintainerEmail = maintainerDoc.Email;  // Assuming Firestore document contains 'Email' field
    
        // Add the maintenance report to Firestore
        await addDoc(collection(dataFire, 'maintenanceReports'), {
          problemDescription,
          selectedMaintainer,
          location,
          createdAt: new Date(),
        });
    
        // Define a fixed subject for the email
        const subject = 'New Maintenance Request';
    
        // Call Firebase Cloud Function to send email
        await sendEmailNotification(maintainerEmail, subject, `There is a new maintenance request at ${location}. Description: ${problemDescription}`);
    
        alert('Request registered successfully, and email sent!');
    
        // Reset form
        setProblemDescription('');
        setSelectedMaintainer('');
        setLocation('');
      } catch (error) {
        console.error('Error adding document: ', error);
        alert(error);
      }
    };
    
    

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'secondary'}>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Damage Report</IonTitle>
          <IonButton color={'dark'} fill="clear" slot='end' routerLink="/app/list-maintenance">
            All the maintainers
           </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'} className='ion-padding'>
        <IonItem color={'dark'}>
            <IonTextarea
            value={problemDescription}
            placeholder="Damage"
            autoGrow={true}
            onIonChange={(e) => setProblemDescription(e.detail.value!)}
            ></IonTextarea>
        </IonItem>
        <IonItem color={'dark'}>
            <IonInput 
            value={location}
            placeholder="Where"
            onIonChange={(e) => setLocation(e.detail.value!)}
            />
        </IonItem>
        <IonItem color={'dark'}>
            <IonSelect
            value={selectedMaintainer} 
            placeholder="Select maintainer"
            onIonChange={(e) => setSelectedMaintainer(e.detail.value)}
            className="custom-select"
            >
                {maintainers.map((maintainer) => (
              <IonSelectOption key={maintainer.id} value={maintainer.id}>
                {maintainer.Name} 
              </IonSelectOption>
            ))}
            </IonSelect>
        </IonItem>
        <IonButton color={'primary'} expand="block" onClick={handleSubmit} >
            Inform 
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Maintenance;
function sendEmailNotification(maintainerEmail: any, subject: any, text: any) {
  throw new Error('Function not implemented.');
}

