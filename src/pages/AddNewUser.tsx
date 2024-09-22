import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonLoading, IonToast, IonMenuButton, IonButtons, IonBackButton } from '@ionic/react';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';
import { useHistory } from 'react-router';

interface PendingUser {
  id: string;
  email: string;
  fullname: string;
  phonenumber: string;
  status: string;
}

const ApproveUsers: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('User');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const history = useHistory(); 

  // Fetch pending users from Firestore
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(dataFire, 'pendingUsers'));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PendingUser[];
      setPendingUsers(usersList);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve the user and assign them a role
  const approveUser = async (userId: string, role: string) => {
    setLoading(true);
    try {
      // Get the user data from 'pendingUsers'
      const userDocRef = doc(dataFire, 'pendingUsers', userId); // Create document reference
      const userSnapshot = await getDoc(userDocRef); // Fetch the document
        
      const userData = userSnapshot.data();

      if (userData) {
        // Move the user to 'users' collection with the selected role
        await setDoc(doc(dataFire, 'users', userId), {
          ...userData,
          role: role,
          status: 'approved',
        });

        // Delete the user from 'pendingUsers' collection
        await deleteDoc(userDocRef);

        setToastMessage('User approved successfully!');
        fetchPendingUsers(); // Refresh the list of pending users
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setToastMessage('Error approving user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'secondary'}>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="/app/list-of-users" />
            
          </IonButtons>
          <IonTitle>New user</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color={'light'} className='ion-padding'>
        <IonLoading isOpen={loading} message={'Loading...'} />
        
          {pendingUsers.map((user) => (
            <IonItem key={user.id} color='dark'>
              <IonLabel >
                <h2>{user.fullname}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phonenumber}</p>
              </IonLabel>

              {/* Role Selection */}
              <IonSelect
                placeholder="Select Role"
                value={selectedRole}
                onIonChange={(e: { detail: { value: React.SetStateAction<string>; }; }) => setSelectedRole(e.detail.value)}
              >
                <IonSelectOption value="Admin">Admin</IonSelectOption>
                <IonSelectOption value="Housekeeper">Housekeeper</IonSelectOption>
                <IonSelectOption value="Maintenance">Maintenance</IonSelectOption>
              </IonSelect>

              {/* Approve Button */}
              <IonButton
                color="primary"
                onClick={() => approveUser(user.id, selectedRole)}
              >
                Approve
              </IonButton>
            </IonItem>
          ))}
       

        {/* Toast Message */}
        <IonToast
         color={'warning'}
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default ApproveUsers;
