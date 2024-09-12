// AddMaintainerModal.tsx
// ListMaintenance.tsx
// DeleteConfirmationAlert.tsx

import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { dataFire } from './FirebaseConfig';
import './Maintenance.css'

const Maintenance: React.FC = () => {
    const [problemDescription, setProblemDescription] = useState<string>(''); 
    const [selectedMaintainer, setSelectedMaintainer] = useState<string>(''); 
    const [location, setLocation] = useState<string>(''); 
    const [maintainers, setMaintainers] = useState<any[]>([]); 
  
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
      if (!problemDescription || !selectedMaintainer || !location ) {
        alert('Please fill in all fields');
        return;
      }
  
      try {
        await addDoc(collection(dataFire, 'maintenance'), {
          problemDescription,
          selectedMaintainer,
          location,
          createdAt: new Date(),
        });
  
        alert('Request registered successfully!');
        
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
