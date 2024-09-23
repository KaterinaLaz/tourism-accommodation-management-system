import React, { useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonToast, IonLoading } from '@ionic/react';
import { arrowBackCircleOutline, addOutline } from 'ionicons/icons'
import { dataFire } from './FirebaseConfig';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import getRealty from './VillasAp';

const AddHome: React.FC = () => {
  const history = useHistory();

  const [apName, setApName] = useState('');
  const [Bathroom, setBathroom] = useState('');
  const [Wc, setwc] = useState('');
  const [SingleBed, setSingleBed] = useState('');
  const [Sauna, setSauna] = useState('');
  const [Rooms, setRooms] = useState('');
  const [OutdoorSpase, setOutDoor] = useState('');
  const [Office, setOffice] = useState('');
  const [OfficeName, setOfficeName] = useState('');
  const [location, setLocation] = useState('');
  const [Levels, setLevels] = useState('');
  const [Kitchen, setKitchen] = useState('');
  const [IndoorSpase, setInDoor] = useState('');
  const [FurnitureOut, setFurnitureOut] = useState('');
  const [DoubleBed, setDoubleBed] = useState('');
  const [ChekinDay, setCheckIn] = useState('');
  const [BroomOut, setBroomOut] = useState('');
  const [Barbecue, setBarbecue] = useState('');
  const [Planting, setPlanting] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const addApartment = async () => {
    setLoading(true);
    setMessage('');

    const newApartment = {
      apName,
      Barbecue,
      BroomOut,
      ChekinDay,
      DoubleBed,
      FurnitureOut,
      IndoorSpase,
      Kitchen,
      Levels,
      location,
      OfficeName,
      Office,
      OutdoorSpase,
      Rooms,
      Sauna,
      SingleBed,
      Wc,
      Bathroom,
      Planting,
    };

    const customId = apName;
    const realtyRef = collection(dataFire, "realty");

    try {
      const docRef = doc(realtyRef, customId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMessage('Home already exists');
      } else {
        await setDoc(docRef, newApartment);
        setMessage('New home record added successfully');

        setApName('');
        setBathroom('');
        setwc('');
        setSingleBed('');
        setSauna('');
        setRooms('');
        setOutDoor('');
        setOffice('');
        setOfficeName('');
        setLocation('');
        setLevels('');
        setKitchen('');
        setInDoor('');
        setFurnitureOut('');
        setDoubleBed('');
        setCheckIn('');
        setBroomOut('');
        setBarbecue('');
        setPlanting('');

        setTimeout(() => {
          history.push(`/app/villas/add/linen/${customId}`, { houseName: apName });
        }, 500);
      }
    } catch (error: any) {
      console.error('Error adding home: ', error);
      setMessage('Error adding home');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton onClick={getRealty} routerLink='/app/villas' fill='clear' size='small' slot='start' color='dark'>
            <IonIcon size='large' icon={arrowBackCircleOutline} />
          </IonButton>
          <IonButton fill='clear' size='small' slot='end' color='dark' onClick={addApartment}>
            <IonIcon size='large' icon={addOutline} />
          </IonButton>
          <IonTitle>Add a new House</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light' className='ion-padding'>
        <IonGrid>
          <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonCard color="dark">
              <IonCardContent>
                {message && (
                  <IonText color={message.includes('successfully') ? 'success' : 'danger'}>
                    {message}
                  </IonText>
                )}
                <IonInput onIonChange={(e: any) => setApName(e.target.value!)} label='Name' labelPlacement="floating" placeholder="Enter Apartment Name" />
                <IonInput onIonChange={(e: any) => setLocation(e.target.value!)} label='Location' labelPlacement="floating" placeholder="Enter Location" />
                <IonInput onIonChange={(e: any) => setInDoor(e.target.value!)} label='In Door Space' labelPlacement="floating" placeholder="Enter s.m." />
                <IonInput onIonChange={(e: any) => setOutDoor(e.target.value!)} label='Out Door Space' labelPlacement="floating" placeholder="Enter s.m." />
                <IonInput onIonChange={(e: any) => setLevels(e.target.value!)} label='Levels' labelPlacement="floating" placeholder="Enter Number of Floors" />
                <IonInput onIonChange={(e: any) => setRooms(e.target.value!)} label='Bedrooms' labelPlacement="floating" placeholder="Enter Number of Bedrooms" />
                <IonInput onIonChange={(e: any) => setBathroom(e.target.value!)} label='Bathroom' labelPlacement="floating" placeholder="Enter Number of Bathrooms" />
                <IonInput onIonChange={(e: any) => setKitchen(e.target.value!)} label='Kitchen' labelPlacement="floating" placeholder="Enter Number of Kitchens" />
                <IonInput onIonChange={(e: any) => setBarbecue(e.target.value!)} label='Barbecue' labelPlacement="floating" placeholder="Yes or No" />
                <IonInput onIonChange={(e: any) => setSauna(e.target.value!)} label='Sauna' labelPlacement="floating" placeholder="Yes or No" />
                <IonInput onIonChange={(e: any) => setwc(e.target.value!)} label='WC' labelPlacement="floating" placeholder="Enter Number of WC" />
                <IonInput onIonChange={(e: any) => setSingleBed(e.target.value!)} label='Single Beds' labelPlacement="floating" placeholder="Enter Number of Single Beds" />
                <IonInput onIonChange={(e: any) => setDoubleBed(e.target.value!)} label='Double Beds' labelPlacement="floating" placeholder="Enter Number of Double Beds" />
                <IonInput onIonChange={(e: any) => setCheckIn(e.target.value!)} label='Check in day' labelPlacement="floating" placeholder="Enter the Check in day" />
                <IonInput onIonChange={(e: any) => setOffice(e.target.value!)} label='Are reservations made through a tourist office?' labelPlacement="floating" placeholder="Yes or No" />
                <IonInput onIonChange={(e: any) => setOfficeName(e.target.value!)} label='Enter the tourist office name or the site name' labelPlacement="floating" placeholder="Enter Name or No" />
                <IonInput onIonChange={(e: any) => setPlanting(e.target.value!)} label='Did we Planting?' labelPlacement="floating" placeholder="Yes or No" />
                <IonInput onIonChange={(e: any) => setFurnitureOut(e.target.value!)} label='Did we clean the furniture outside?' labelPlacement="floating" placeholder="Yes or No" />
                <IonInput onIonChange={(e: any) => setBroomOut(e.target.value!)} label='Did we broom outside?' labelPlacement="floating" placeholder="Yes or No" />
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonGrid>
        <IonLoading
          isOpen={loading}
          message={'Please wait...'}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={message}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddHome;
