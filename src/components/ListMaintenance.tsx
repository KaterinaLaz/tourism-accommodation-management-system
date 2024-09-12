import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonButtons, IonMenuButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { informationCircleOutline, addOutline, trashOutline } from 'ionicons/icons';
import { dataFire } from '../pages/FirebaseConfig';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import AddMaintainerModal from './AddMaintainerModal'; 
import DeleteConfirmationAlert from './DeleteConfirmationAlert';

const MaintainerList: React.FC = () => {
  const [maintainers, setMaintainers] = useState<any[]>([]);
  const [selectedMaintainer, setSelectedMaintainer] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [maintainerToDelete, setMaintainerToDelete] = useState<any | null>(null); 

  const fetchMaintainers = async () => {
    const querySnapshot = await getDocs(collection(dataFire, 'maintenance'));
    const maintainersList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMaintainers(maintainersList);
  };

  useEffect(() => {
    fetchMaintainers();
  }, []);

  const handleShowDetails = (maintainer: any) => {
    setSelectedMaintainer(maintainer);
    setShowModal(true);
  };

  // Callback function to refresh the maintainers list after adding a new one
  const handleMaintainerAdded = () => {
    fetchMaintainers(); // Re-fetch the list after a new maintainer is added
  };

  // When the user clicks the trash icon, confirm before deleting
  const handleDeleteMaintainer = (maintainer: any) => {
    setMaintainerToDelete(maintainer);
    setShowDeleteAlert(true); // Show the delete confirmation alert
  };

  // Update of the list of the remaining craftsmens
  const confirmDeleteMaintainer = async () => {
    if (maintainerToDelete) {
      try {
        console.log('Attempting to delete maintainer with ID:', maintainerToDelete.id);
        
        await deleteDoc(doc(dataFire, 'maintenance', maintainerToDelete.id));
        console.log('Maintainer deleted successfully:', maintainerToDelete.id);
  
        // Update of the list of the remaining craftsmen
        setMaintainers((prevMaintainers) =>
          prevMaintainers.filter((m) => m.id !== maintainerToDelete.id)
        );
  
        setMaintainerToDelete(null); 
      } catch (error) {
        console.error('Error deleting maintainer:', error);
        alert('Failed to delete maintainer');
      }
    }
    setShowDeleteAlert(false); 
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Maintainers List</IonTitle>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" color={'light'}>
        
          {maintainers.map((maintainer) => (
            <IonItem color={'dark'} key={maintainer.id}>
              <IonLabel>{maintainer.Name}</IonLabel>
              <IonButton fill="clear" onClick={() => handleShowDetails(maintainer)}>
                <IonIcon slot="icon-only" icon={informationCircleOutline} />
              </IonButton>
              <IonButton fill="clear" onClick={() => handleDeleteMaintainer(maintainer)}>
                <IonIcon slot="icon-only" color="danger" icon={trashOutline} />
              </IonButton>
            </IonItem>
          ))}
   
        {/* Add new maintainer button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShowAddModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal to add new maintainer */}
        <AddMaintainerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onMaintainerAdded={handleMaintainerAdded} // Pass the callback to the modal
        />

        {/* Modal to show maintainer details */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="secondary">
              <IonTitle>Maintainer Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent  className="ion-padding">
            {selectedMaintainer && (
              <>
                <p><strong>Name:</strong> {selectedMaintainer.Name}</p>
                <p><strong>Phone:</strong> {selectedMaintainer.Phone}</p>
                <p><strong>Specialty:</strong> {selectedMaintainer.Specialty}</p>
              </>
            )}
          </IonContent>
        </IonModal>
        
        {/* Delete confirmation alert */}
        <DeleteConfirmationAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          onConfirm={confirmDeleteMaintainer} // Call confirm delete function
        />
      </IonContent>
    </IonPage>
  );
};

export default MaintainerList;
