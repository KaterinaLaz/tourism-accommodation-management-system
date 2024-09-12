import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
    IonItem, IonLabel,  IonAlert, IonGrid
} from '@ionic/react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';
import './status.css'

interface House {
    id: string;
    status: string;
}

const Status: React.FC = () => {
    const [houses, setHouses] = useState<House[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchHouses = async () => {
            const querySnapshot = await getDocs(collection(dataFire, 'realty'));  // Assuming 'realty' is your collection name
            const housesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                status: doc.data().status,
            }));
            setHouses(housesData);
        };

        fetchHouses();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            // Update the local state
            setHouses(prevHouses =>
                prevHouses.map(house =>
                    house.id === id ? { ...house, status: newStatus } : house
                )
            );

            // Update the status in Firestore
            const houseDoc = doc(dataFire, 'realty', id);
            await updateDoc(houseDoc, { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const openStatusAlert = (house: House) => {
        setSelectedHouse(house);
        setShowAlert(true);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'secondary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>House Status</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'} className='ion-padding'>
                <IonGrid color='light'>
                    {houses.map(house => (
                        <IonItem color={'dark'} key={house.id} button onClick={() => openStatusAlert(house)}>
                            <IonLabel>
                                {house.id}
                            </IonLabel>
                            <IonLabel>
                                Status: {house.status}
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonGrid>

                {selectedHouse && (
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header="Select Status"
                        cssClass="custom-alert"
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                            },
                            {
                                text: 'OK',
                                handler: (newStatus: string) => {
                                    handleStatusChange(selectedHouse.id, newStatus);
                                }
                            }
                        ]}
                        inputs={[
                            {
                                label: 'Clean and Checked',
                                type: 'radio',
                                value: 'Clean and Checked',
                                checked: selectedHouse?.status === 'Clean and Checked',
                            },
                            {
                                label: 'Occupied',
                                type: 'radio',
                                value: 'Occupied',
                                checked: selectedHouse?.status === 'Occupied',
                            },
                            {
                                label: 'Dirty',
                                type: 'radio',
                                value: 'Dirty',
                                checked: selectedHouse?.status === 'Dirty',
                            },
                            {
                                label: 'Working on it',
                                type: 'radio',
                                value: 'Working on it',
                                checked: selectedHouse?.status === 'Working on it',
                            },
                            {
                                label: 'Maintenance',
                                type: 'radio',
                                value: 'Maintenance',
                                checked: selectedHouse?.status === 'Maintenance',
                            },
                        ]}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Status;
