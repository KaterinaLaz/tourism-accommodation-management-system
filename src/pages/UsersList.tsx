import { IonButton, IonButtons,  IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel,  IonMenuButton, IonPage, IonTitle, IonToolbar, IonAlert, IonBadge } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig'; 
import { addOutline, informationCircleOutline, trash, trashOutline } from 'ionicons/icons'; 
import { useHistory } from 'react-router';

interface User {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string;
  role: string;
}

const ListOfUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUserCount, setPendingUserCount] = useState(0); // To track the number of pending users
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const history = useHistory();

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(dataFire, 'users'));
    const usersList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as User[];

    const rolePriority: { [key: string]: number } = {
      'Admin': 1,
      'Housekeeper': 2,
      'Maintenance': 3
    };

    // Sort the users based on the role priority
    usersList.sort((a, b) => {
      return (rolePriority[a.role] || 4) - (rolePriority[b.role] || 4);
    });

    setUsers(usersList);
  };

  // Fetch pending users count
  const fetchPendingUsersCount = async () => {
    const querySnapshot = await getDocs(collection(dataFire, 'pendingUsers'));
    const pendingCount = querySnapshot.size; // Get the number of pending users
    setPendingUserCount(pendingCount);
  };

  useEffect(() => {
    fetchUsers(); // Fetch users initially
    fetchPendingUsersCount(); // Fetch pending users count initially

    const unlisten = history.listen((location: { pathname: string; }, action: any) => {
      if (location.pathname === '/app/list-of-users') {
        fetchUsers(); // Fetch users again when the user returns to this page
        fetchPendingUsersCount(); // Fetch pending users count when returning
      }
    });

    return () => {
      unlisten(); // Cleanup the listener when the component unmounts
    };
  }, [history]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(dataFire, 'users', userId)); // Delete user from Firestore
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setShowAlert(true);
  };

  const navigateToRegister = () => {
    history.push('/app/users/add');
  };

  return (
    <IonPage>
      <IonHeader>
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
            <IonButton fill="clear" slot="end" color='danger' onClick={() => confirmDelete(user)}>
              <IonIcon icon={trashOutline} />
            </IonButton>
          </IonItem>
        ))}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color={pendingUserCount > 0 ? 'danger' : 'primary'}  onClick={navigateToRegister}>
            <IonIcon
              icon={informationCircleOutline}
            />
            {pendingUserCount > 0 && (
              <IonBadge color="danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                {pendingUserCount}
              </IonBadge>
            )}
          </IonFabButton>
        </IonFab>

        {/* Alert for delete confirmation */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Delete User'}
          message={`Are you sure you want to delete ${selectedUser?.fullname}?`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                setShowAlert(false); // Close alert
              }
            },
            {
              text: 'Delete',
              handler: () => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser.id); // Delete the selected user
                }
                setShowAlert(false); // Close alert
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ListOfUsers;
