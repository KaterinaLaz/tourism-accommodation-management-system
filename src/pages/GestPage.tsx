import { doc, getDoc } from "firebase/firestore";
import { dataFire } from './FirebaseConfig';
import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonInput, IonButton, IonContent, IonItem, IonLabel, IonToast, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonButtons, IonIcon, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons'; // Back arrow icon

const Gestpage: React.FC = () => {
  const [eventId, setEventId] = useState<string>(''); // To store the user's input for the event ID
  const [realtyStatus, setRealtyStatus] = useState<string | null>(null); // To store the retrieved realty status
  const [error, setError] = useState<string | null>(null); // To handle any errors

  const history = useHistory(); // To handle navigation

  // Function to fetch the realtyId from the event, and then query the realty collection for its status
  const fetchRealtyStatus = async () => {
    setError(null); // Clear any previous errors
    if (!eventId) {
      setError("Please enter an event ID");
      return;
    }

    try {
      // 1. Fetch the event by eventId to get the realtyId
      const eventDocRef = doc(dataFire, 'events', eventId);
      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        const realtyId = eventData.realtyId; // Get the realtyId from the event

        if (realtyId) {
          // 2. Use the realtyId to fetch the realty document and get its status
          const realtyDocRef = doc(dataFire, 'realty', realtyId);
          const realtyDoc = await getDoc(realtyDocRef);

          if (realtyDoc.exists()) {
            const realtyData = realtyDoc.data();
            setRealtyStatus(realtyData.status || "No status available"); // Assuming 'status' is a field in the realty document
          } else {
            setRealtyStatus(null);
            setError("Realty not found");
          }
        } else {
          setRealtyStatus(null);
          setError("Realty ID not found in event");
        }
      } else {
        setRealtyStatus(null);
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event/realty:", err);
      setError("An error occurred while fetching the data");
    }
  };

  // Handle the back button click
  const handleBack = () => {
    history.goBack(); // Navigate to the previous page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton onClick={handleBack}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Event Realty Status Query</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color={'light'} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonRow className="ion-justify-content-center">
                        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4" > 
                            <IonImg src='src\pages\logo-1.png'>
                            </IonImg>
                        </IonCol>
                    </IonRow>
              <IonCard color="light">
                <IonCardContent>
                  <IonItem color={'dark'}>
                    <IonLabel position="stacked">Enter Event ID</IonLabel>
                    <IonInput
                      value={eventId}
                      placeholder="Enter ID..."
                      onIonChange={(e: { detail: { value: React.SetStateAction<string>; }; }) => setEventId(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="block" onClick={fetchRealtyStatus} className="ion-margin-top">
                    Fetch Realty Status
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {realtyStatus && (
          <IonItem color={'tertiary'} className="ion-margin-top">
            <IonLabel>Realty Status: {realtyStatus}</IonLabel>
          </IonItem>
        )}

        {/* Display any errors */}
        {error && (
          <IonToast
            color="danger"
            isOpen={!!error}
            message={error}
            duration={2000}
            onDidDismiss={() => setError(null)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Gestpage;
