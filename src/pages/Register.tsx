import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { auth } from './FirebaseConfig';
import { dataFire } from './FirebaseConfig';

import { createUserWithEmailAndPassword, deleteUser, getAuth, signOut } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { useHistory } from 'react-router';


import {  updateDoc, deleteField } from "firebase/firestore";



const Register: React.FC = () => {
    
    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Name, setName] = useState('');
    const [Telephone, setTelephone] = useState('');

    const [loading, setLoading] = useState(false);
    const [successAcount, setSuccessAcount] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();
    const [Role, setRole] = useState('User')
    const [showAlert, setShowAlert] = useState(false);
    

    useEffect(() => {
        const clearFields = () => {
            setEmail('');
            setPassword('');
            setName('');
            setTelephone('');
            setRole('');
        };

        clearFields();

        const unlisten = history.listen((location, action) => {
            if (location.pathname === '/register') {
                clearFields();
            }
        });

        return () => {
            unlisten();
        };
    }, [history]);


    async function registerUser() {
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, Email, password);
            const UserID = userCredential.user.uid;

            await setDoc(doc(dataFire, 'users', UserID), {
                email: Email,
                fullname: Name,
                phonenumber: Telephone,
                role: Role,
            });

            setSuccessAcount(true);
            setLoading(false);

            setEmail('');
            setPassword('');
            setName('');
            setTelephone('');

            setTimeout(() => {
                history.push('/app/list-of-users'); 
            }, 2000);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already in use!');

                // Handle user deletion if necessary
                try {
                    const user = auth.currentUser;
                    if (user) {
                        await deleteUser(user);
                    }
                } catch (deleteError) {
                    console.error("Error deleting user: ", deleteError);
                }

            } else {
                setError(error.message);
            }
            setLoading(false);
        }
    }

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
    }
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'secondary'}>
                    
                    <IonTitle>Make a Profile</IonTitle>
                    <IonButtons slot='start'>
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
                <IonCard color={'dark'}>
                    <IonCardContent>
                        <IonInput
                            label='Name'
                            labelPlacement="floating"
                            placeholder="Enter Your Full Name"
                            value={Name}
                            onIonChange={(e) => setName(e.detail.value!)}
                        />
                        
                        <IonInput
                            label='Telephone'
                            type='tel'
                            labelPlacement="floating"
                            placeholder="Enter Your Phone Number"
                            value={Telephone}
                            onIonChange={(e) => setTelephone(e.detail.value!)}
                        />
                        <IonInput
                            label='Email'
                            labelPlacement="floating"
                            placeholder="Enter your Email"
                            value={Email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        />
                        <IonInput
                            label='Password'
                            type="password"
                            labelPlacement="floating"
                            placeholder="Enter your Password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        />
                        <IonItem color={'dark'} button onClick={() => setShowAlert(true)}>
                            <IonLabel>
                                Role: {Role}  {/* Display the selected role */}
                            </IonLabel>
                        </IonItem>
                        
                        
                        <IonButton onClick={registerUser} color={'secondary'} expand='block'>
                            Register
                        </IonButton>
                        <IonAlert
                            isOpen={showAlert}
                            onDidDismiss={() => setShowAlert(false)}
                            header="Select Role"
                            inputs={[
                            
                                {
                                    label: 'Admin',
                                    type: 'radio',
                                    value: 'Admin',
                                    checked: Role === 'Admin',
                                },
                                {
                                    label: 'Housekeeper',
                                    type: 'radio',
                                    value: 'Housekeeper',
                                    checked: Role === 'Housekeeper',
                                }
                            ]}
                            buttons={[
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                },
                                {
                                    text: 'OK',
                                    handler: (selectedRole: string) => {
                                        handleRoleChange(selectedRole);
                                    },
                                }
                            ]}
                        />

                        
                    </IonCardContent>
                </IonCard>
                <IonLoading isOpen={loading} message="Creating account..." />
                <IonToast
                    isOpen={successAcount}
                    message="Account created successfully!"
                    duration={2000}
                    color="success"
                />
                <IonToast
                    isOpen={!!error}
                    message={error}
                    duration={3000}
                    color="danger"
                    onDidDismiss={() => setError('')}
                />
            </IonContent>
        </IonPage>
    );
};

export default Register;
