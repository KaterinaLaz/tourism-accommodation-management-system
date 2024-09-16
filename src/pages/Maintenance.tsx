import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { dataFire } from './FirebaseConfig';
import { useAuth } from '../components/AuthContext'; // Import the useAuth hook
import './Maintenance.css';

// Define the User type with the expected fields
interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
}

const Maintenance: React.FC = () => {
  const { role } = useAuth(); // Get the role from Auth context
  const [problemDescription, setProblemDescription] = useState<string>(''); 
  const [selectedMaintainer, setSelectedMaintainer] = useState<string>(''); 
  const [location, setLocation] = useState<string>(''); 
  const [maintainers, setMaintainers] = useState<User[]>([]); // Use the User type for maintainers

  // Fetch only users with the "Maintenance" role from the "users" collection
  useEffect(() => {
    const fetchMaintainers = async () => {
      try {
        // Query to get only the users with the role "Maintenance"
        const q = query(collection(dataFire, 'users'), where('role', '==', 'Maintenance'));
        const querySnapshot = await getDocs(q); // Fetch users with role "Maintenance"
        const maintainersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          fullname: doc.data().fullname, // Ensure that fullname exists
          email: doc.data().email,
          role: doc.data().role
        }));
      
        setMaintainers(maintainersList); // Set the maintainers in state
      } catch (error) {
        console.error('Error fetching maintainers:', error);
      }
    };

    fetchMaintainers();
  }, []);

  const handleSubmit = async () => {
    if (!problemDescription || !selectedMaintainer || !location) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Store the report in the 'maintenanceReports' collection
      await addDoc(collection(dataFire, 'maintenanceReports'), {
        problemDescription,
        selectedMaintainer,
        location,
        createdAt: new Date(),
      });

      alert('Request registered successfully!');
      
      // Clear form fields
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
                {maintainer.fullname} 
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
