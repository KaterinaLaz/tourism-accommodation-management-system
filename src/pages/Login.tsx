//FirebaseConfig.ts

import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { arrowForwardOutline, bookOutline, logInOutline,personCircleOutline, sparklesOutline } from 'ionicons/icons';

import { auth } from './FirebaseConfig';
import {dataFire} from './FirebaseConfig'
import {sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'

import { useHistory } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';

import { useAuth } from '../components/AuthContext'; 

const Login: React.FC = () => {
    // setEmail & setPassword they are function to "keep" users credentials 
    //[,] they are tables
    const[Email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')  // State for storing error message
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    let history = useHistory()
    

  // When the user logs out, reset the fields
    useEffect(() => {
        if (!isAuthenticated) {
            setEmail(''); // Reset email field
            setPassword(''); // Reset password field
        }
    }, [isAuthenticated]);
    
    
    // If pres “FORGOT PASSWORD”, Firebase sent you an auto email to change your password
    function forgotPassword(){
        // A popup opens and ask you for your email
        const email = prompt('Please enter your email')
        sendPasswordResetEmail(auth,Email)
            .then(() => {
                alert('Check your Email')
            })
    }
    //When press login start this function. 
    function loginUser() {
        setLoading(true); // Start loading
    
        signInWithEmailAndPassword(auth, Email, password)
            .then(async (userCredential) => {
                const UserID = userCredential.user.uid;
                const userDocRef = doc(dataFire, 'users', UserID);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const role = userDoc.data().role as string;
    
                    login(role);
    
                    if (role === 'Maintenance') {
                        history.push('/app/my-job');
                    } else {
                        // Redirect to the main app page; PrivateRoute will handle role-based access
                        history.push('/app');
                    }
                } else {
                    setErrorMessage('User does not exist');
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false); // Stop loading
            });
    }
    
        
    

    return (
        <IonPage >
            <IonHeader >
                <IonToolbar color={'new'} > 
                    
                    <IonTitle style={{ fontSize: '35px' , textAlign: 'center'}}> <IonIcon icon={sparklesOutline}></IonIcon>  House Hero  <IonIcon icon={sparklesOutline}> </IonIcon></IonTitle>
                    
                </IonToolbar>
            </IonHeader>
            <IonContent  color={'light'} className="ion-padding" >
                <IonGrid fixed >
                    <IonRow class="ion-justify-content-center">
                        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4" > 
                            <IonImg src='src\pages\logo-1.png'>
                            </IonImg>
                        </IonCol>
                    </IonRow>

                    <IonRow class="ion-justify-content-center">
                        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                            <IonCard   color={'dark'}>
                                <IonCardContent  >
                                    <IonInput 
                                        value={Email}
                                        mode='md'
                                        label='Email' 
                                        labelPlacement="floating" 
                                        placeholder="Enter your Email"
                                        onIonChange={(e: any) => setEmail(e.target.value)}
                                    />
                                    <IonInput
                                        value={password}
                                        mode='md'
                                        label='Password' 
                                        type="password" 
                                        labelPlacement="floating" 
                                        placeholder="Enter your Password" 
                                        onIonChange={(e: any) => setPassword(e.target.value)}
                                    />
                                    <IonButton onClick={loginUser} className='ion-margin-top' type='submit' expand='block' color={'secondary'} >
                                        Login
                                        <IonIcon icon={logInOutline}> </IonIcon>
                                    </IonButton>
                                    
                                    <IonButton onClick={forgotPassword} className='forgot-password-baton' fill="clear"  expand='block' style={{ color: '#74a59c' }}>
                                        Forgot Password?
                                    </IonButton>
                                    <IonLoading  isOpen={loading} message={'Please wait...'} />
                                    {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        
                    </IonRow>
                    <IonButton className='ion-margin-top'routerLink='/booking-status'  type='submit' expand='block'  color={'warning'} >
                            To See Booking Status
                            <IonIcon icon={arrowForwardOutline}/>
                        </IonButton>
                </IonGrid>                            
            </IonContent>
        </IonPage>
    );
};

export default Login;