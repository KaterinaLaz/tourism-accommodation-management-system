import React, { useEffect, useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonText, IonButtons, IonMenuButton,
    IonGrid, IonButton, IonIcon, IonRow, IonCol, IonModal, IonInput
} from '@ionic/react';
import { auth, dataFire } from './FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { pencil, closeCircleOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editedData, setEditedData] = useState<any>({});

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getUserData();
            if (userData) {
                setUserData(userData);
                setEditedData(userData); // Initialize edited data with user data
            }
        };
        fetchUserData();
    }, []);

    const getUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(dataFire, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    return { id: userDoc.id, ...userDoc.data() };
                } else {
                    console.log("No such document!");
                    return null;
                }
            } else {
                console.log("No user is signed in.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            return null;
        }
    };

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleSaveClick = async () => {
        try {
            if (userData && userData.id) {
                const userDocRef = doc(dataFire, "users", userData.id);
                await updateDoc(userDocRef, editedData); // Update Firestore with the edited data
                setUserData(editedData); // Update local state with the edited data
                setIsModalOpen(false); // Close the modal
            }
        } catch (error) {
            console.error("Error saving user data: ", error);
        }
    };

    const handleInputChange = (e: CustomEvent) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;
        setEditedData({
            ...editedData,
            [name]: value,
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Profile</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleEditClick}>
                            <IonIcon slot="icon-only" icon={pencil} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'} className='ion-padding'>
                <IonGrid>
                    {userData ? (
                        <>
                            <IonItem color={'dark'} lines="full">
                                <IonLabel>Email</IonLabel>
                                <IonText>{userData.email}</IonText>
                            </IonItem>

                            <IonItem color={'dark'} lines="full">
                                <IonLabel>Display Name</IonLabel>
                                <IonText>{userData.fullname || 'Not provided'}</IonText>
                            </IonItem>

                            <IonItem color={'dark'} lines="full">
                                <IonLabel>Phone Number</IonLabel>
                                <IonText>{userData.phonenumber || 'Not provided'}</IonText>
                            </IonItem>

                            <IonItem color={'dark'} lines="full">
                                <IonLabel>Role</IonLabel>
                                <IonText>{userData.role}</IonText>
                            </IonItem>
                        </>
                    ) : (
                        <IonText>Loading user details...</IonText>
                    )}
                </IonGrid>

                <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <IonHeader>
                        <IonToolbar color="secondary">
                            <IonTitle>Edit Profile</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsModalOpen(false)}>
                                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent color={'light'} className="ion-padding">
                        <IonItem color={'dark'}>
                            <IonLabel position="stacked">Email</IonLabel>
                            <IonInput
                                value={editedData.email}
                                onIonChange={handleInputChange}
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </IonItem>

                        <IonItem color={'dark'}>
                            <IonLabel position="stacked">Display Name</IonLabel>
                            <IonInput
                                value={editedData.fullname}
                                onIonChange={handleInputChange}
                                name="fullname"
                                type="text"
                                placeholder="Enter your name"
                            />
                        </IonItem>

                        <IonItem color={'dark'}>
                            <IonLabel position="stacked">Phone Number</IonLabel>
                            <IonInput
                                value={editedData.phonenumber}
                                onIonChange={handleInputChange}
                                name="phonenumber"
                                type="tel"
                                placeholder="Enter your phone number"
                            />
                        </IonItem>

                        <IonItem color={'dark'}>
                            <IonLabel position="stacked">Role</IonLabel>
                            <IonText>{userData.role}</IonText>
                        </IonItem>

                        <IonButton expand="block" color="secondary" onClick={handleSaveClick}>
                            Save
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
