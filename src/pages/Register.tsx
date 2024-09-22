import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonLoading, IonMenuButton, IonPage, IonRow, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { auth } from './FirebaseConfig';
import { dataFire } from './FirebaseConfig';

import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useHistory } from 'react-router';

import logo from './logo-1.png';


const Register: React.FC = () => {
    const [Email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [Name, setName] = useState<string>('');
    const [Telephone, setTelephone] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [successAcount, setSuccessAcount] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const clearFields = () => {
            setEmail('');
            setPassword('');
            setName('');
            setTelephone('');
        };

        const unlisten = history.listen((location: { pathname: string }, action: any) => {
            if (location.pathname === '/register') {
                clearFields();
            }
        });

        return () => {
            unlisten();
        };
    }, [history]);

    useEffect(() => {
        if (successAcount) {
            setTimeout(() => {
                history.push('/login'); // Redirect to login page after success
            }, 2000); // Wait for 2 seconds before redirecting
        }
    }, [successAcount, history]);

    // Function to create a new user in Firebase Authentication and store their data in Firestore
    async function registerUser() {
        setLoading(true);
        setError('');
        try {
            const currentUser = auth.currentUser;
    
            // Create the new user
            const userCredential = await createUserWithEmailAndPassword(auth, Email, password);
            const UserID = userCredential.user.uid;
    
            // Save the new user's data in the 'pendingUsers' collection without a role
            await setDoc(doc(dataFire, 'pendingUsers', UserID), {
                email: Email,
                fullname: Name,
                phonenumber: Telephone,
                status: 'pending', // The status is pending
                createdAt: new Date()
            });
    
            setSuccessAcount(true);
            setLoading(false);
    
            // Clear form fields after user creation
            setEmail('');
            setPassword('');
            setName('');
            setTelephone('');
    
            // Sign out the new user
            await signOut(auth);
    
            setTimeout(() => {
                history.push('/login'); // Redirect to the login page or wherever you want
            }, 2000);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already in use!');
            } else {
                setError(error.message);
            }
            setLoading(false);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'secondary'}>
                    <IonTitle>Create Account</IonTitle>
                    <IonMenuButton slot='start' />
                </IonToolbar>
            </IonHeader>
            <IonContent  color={'dark'} className="ion-padding" >
                <IonGrid fixed >
                    <IonRow className="ion-justify-content-center">
                        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4" > 
                            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4" > 
                                <IonImg src={logo}></IonImg>
                            </IonCol>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonCard color={'dark'}>
                    <IonCardContent>
                        <IonInput
                            label='Name'
                            labelPlacement="floating"
                            placeholder="Enter Your Full Name"
                            value={Name}
                            onIonChange={(e: { detail: { value: any; }; }) => setName(e.detail.value!)}
                        />
                        <IonInput
                            label='Telephone'
                            type='tel'
                            labelPlacement="floating"
                            placeholder="Enter Your Phone Number"
                            value={Telephone}
                            onIonChange={(e: { detail: { value: any; }; }) => setTelephone(e.detail.value!)}
                        />
                        <IonInput
                            label='Email'
                            labelPlacement="floating"
                            placeholder="Enter your Email"
                            value={Email}
                            onIonChange={(e: { detail: { value: any; }; }) => setEmail(e.detail.value!)}
                        />
                        <IonInput
                            label='Password'
                            type="password"
                            labelPlacement="floating"
                            placeholder="Enter your Password"
                            value={password}
                            onIonChange={(e: { detail: { value: any; }; }) => setPassword(e.detail.value!)}
                        />

                        <IonButton onClick={registerUser} color={'secondary'} expand='block'>
                            Register
                        </IonButton>
                    </IonCardContent>
                </IonCard>
                <IonLoading isOpen={loading} message="Creating account..." />
                <IonToast
                    isOpen={successAcount}
                    message="We will soon accept your request"
                    duration={2000}
                    color='warning'
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
