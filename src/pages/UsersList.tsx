import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig'; 
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';

interface User {
  fullname: string;
  email: string;
  phonenumber: string;
  role: string;
}

const ListOfUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const history = useHistory();

  useEffect(() => {
    
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(dataFire, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      })) as unknown as User[];
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const navigateToRegister = () => {
    history.push('/app/users/add');
  };

  return (
    <IonPage>
      <IonHeader >
        <IonToolbar color={'secondary'}>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>List of Employees</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'} className='ion-padding'>
      
        
          {users.map((user, index) => (
            <IonItem color={'dark'} key={index}>
              <IonLabel>
                <h2>{user.fullname}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phonenumber}</p>
                <p>Role: {user.role}</p>
              </IonLabel>
            </IonItem>
          ))}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" onClick={navigateToRegister}> 
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
            
      </IonContent>
    </IonPage>
  );
};

export default ListOfUsers;
