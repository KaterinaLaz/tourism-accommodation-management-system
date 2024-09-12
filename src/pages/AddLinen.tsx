import React, { useEffect, useState } from 'react'
import {IonButton,IonCard,IonCardContent,IonCol,IonContent,IonHeader,IonIcon,IonInput,IonItem,IonLabel, IonPage,IonTitle,IonToolbar,IonGrid,IonText, IonToast, IonLoading} from '@ionic/react'
import { arrowBackCircleOutline, addOutline, saveOutline } from 'ionicons/icons'
import { useHistory, useLocation } from 'react-router-dom'
import { dataFire } from './FirebaseConfig'
import { collection, setDoc, doc, getDoc } from 'firebase/firestore'

interface LocationState {
  houseName?: string; // Define the type for houseName
}

const AddLinen: React.FC = () => {
  const [apName, setApName] = useState('')
  const [LaundryName, setLaundryName] = useState('')
  const [DoubleBedSheets, setDoubleBedSheets] = useState('')
  const [SingleBedSheets, setSingleBedSheets] = useState('')
  const [PillowCases, setPillowCases] = useState('')
  const [BigTowels, setBigTowels] = useState('')
  const [SmallTowels, setSmallTowels] = useState('')
  const [Coverlets, setCoverlets] = useState('')
  const [FittedSheets, setFittedSheets] = useState('')
  const [QuiltedPillowCases, setQuiltedPillowCases] = useState('')
  const [HandTowels, setHandTowels] = useState('')
  const [Robe, setRobe] = useState('')
  const [PoolTowels, setPoolTowels] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const history = useHistory();

  const location = useLocation();

  useEffect(() => {
    // Type cast location.state explicitly to the expected shape
    const state = location.state as LocationState;

    // Check if houseName exists and set the apName
    if (state && state.houseName) {
      setApName(state.houseName); // Auto-fill the house name
    }
  }, [location]);

  const addLinen = async () => {
    setLoading(true)
    setMessage('')

    const newLinen = {
      apName,
      LaundryName,
      DoubleBedSheets,
      SingleBedSheets,
      PillowCases,
      BigTowels,
      SmallTowels,
      Coverlets,
      FittedSheets,
      QuiltedPillowCases,
      HandTowels,
      Robe,
      PoolTowels,
    }

    const customId = apName
    const realtyRef = collection(dataFire, 'linen')

    try {
      // Check if the document already exists
      const docRef = doc(realtyRef, customId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // If document exists, display an error message
        setMessage('Record already exists')
      } else {
        // If document does not exist, add the new record
        await setDoc(docRef, newLinen)
        setMessage('New linen record added successfully')

        // Clear input field
        setApName('')
        setLaundryName('')
        setDoubleBedSheets('')
        setSingleBedSheets('')
        setPillowCases('')
        setBigTowels('')
        setSmallTowels('')
        setCoverlets('')
        setFittedSheets('')
        setQuiltedPillowCases('')
        setHandTowels('')
        setRobe('')
        setPoolTowels('')

        setTimeout(() => {
          history.push('/app/villas'), { reload: true }
        }, 500); // Navigate to another page after 0.5 seconds
      }
    } catch (error: any) {
      console.error('Error adding linen: ', error)
      setMessage('Error adding linen')
    } finally {
      setLoading(false)
      setShowToast(true)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton routerLink="/app/villas/add" fill="clear" size="small" slot="start" color="dark">
            <IonIcon size="large" icon={arrowBackCircleOutline} />
          </IonButton>
          <IonButton fill="clear" size="small" slot="end" color="dark" onClick={addLinen}>
            <IonIcon size="large" icon={saveOutline} />
          </IonButton>
          <IonTitle>Add Linen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonGrid>
          <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonCard color="dark">
              <IonCardContent color="dark">
                {message && (
                  <IonText color={message.includes('successfully') ? 'success' : 'danger'}>
                    {message}
                  </IonText>
                )}
                <IonItem color="dark">
                  <IonLabel position="stacked">Apartment Name</IonLabel>
                  <IonInput value={apName} onIonChange={(e) => setApName(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Laundry Name</IonLabel>
                  <IonInput value={LaundryName} onIonChange={(e) => setLaundryName(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Double Bed Sheets</IonLabel>
                  <IonInput value={DoubleBedSheets} onIonChange={(e) => setDoubleBedSheets(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Single Bed Sheets</IonLabel>
                  <IonInput value={SingleBedSheets} onIonChange={(e) => setSingleBedSheets(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Pillow Cases</IonLabel>
                  <IonInput value={PillowCases} onIonChange={(e) => setPillowCases(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Big Towels</IonLabel>
                  <IonInput value={BigTowels} onIonChange={(e) => setBigTowels(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Small Towels</IonLabel>
                  <IonInput value={SmallTowels} onIonChange={(e) => setSmallTowels(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Coverlets</IonLabel>
                  <IonInput value={Coverlets} onIonChange={(e) => setCoverlets(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Fitted Sheets</IonLabel>
                  <IonInput value={FittedSheets} onIonChange={(e) => setFittedSheets(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Quilted Pillow Cases</IonLabel>
                  <IonInput value={QuiltedPillowCases} onIonChange={(e) => setQuiltedPillowCases(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Hand Towels</IonLabel>
                  <IonInput value={HandTowels} onIonChange={(e) => setHandTowels(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Robe</IonLabel>
                  <IonInput value={Robe} onIonChange={(e) => setRobe(e.detail.value!)} />
                </IonItem>
                <IonItem color="dark">
                  <IonLabel position="stacked">Pool Towels</IonLabel>
                  <IonInput value={PoolTowels} onIonChange={(e) => setPoolTowels(e.detail.value!)} />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonGrid>
        <IonLoading
          isOpen={loading}
          message={'Please wait...'}
        />
        <IonToast
          color={'warning'}
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={message}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  )
}
export default AddLinen
