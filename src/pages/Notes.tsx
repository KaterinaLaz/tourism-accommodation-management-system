import React, { useState, useEffect, useRef } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonItem, IonLabel, IonTextarea, IonButton, 
    IonCard,IonGrid,IonCol,IonIcon,IonRefresher,RefresherEventDetail,IonRefresherContent
} from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';
import { trashOutline } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';


const Notes: React.FC = () => {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState<{ note: string; id: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const modal = useRef<HTMLIonModalElement>(null);

    const saveNote = async (noteData: { note: string }) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            const notesCollection = collection(dataFire, 'notes');
            await addDoc(notesCollection, {
                ...noteData,
                userId: user.uid, 
                createdAt: new Date()
            });
        } else {
            throw new Error("User not authenticated");
        }
    };

     // Function to fetch notes for the authenticated user

    const getNotesForUser = async (userId: string): Promise<{ note: string; id: string }[]> => {
        const notesCollection = collection(dataFire, 'notes');
        const q = query(notesCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
    
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            note: doc.data().note,
        }));
    };

    const fetchNotes = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userNotes = await getNotesForUser(user.uid); 
                setNotes(userNotes);
            } else {
                setErrorMessage('User not authenticated');
            }
        } catch (error) {
            setErrorMessage('Error fetching notes');
        } finally {
            setShowLoading(false); 
        }
        
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 2000); 

            return () => clearTimeout(timer); 
        }
    }, [errorMessage]);

    // Handle saving a new note
    const handleSaveNote = async () => {
        // Automatically blur (close) the keyboard before proceeding
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && typeof activeElement.blur === 'function') {
            activeElement.blur();  // Blur input field to close the keyboard
        }
    
        if (note.trim()) {
            try {
                await saveNote({ note });
                setNote('');
                fetchNotes(); // Refresh the notes after saving
                setShowToast(true); // Show success toast
            } catch (error) {
                setErrorMessage('Error saving note');
            }
        } else {
            setErrorMessage('Please enter a note.');
        }
    }

    const deleteNote = async (noteId: string) => {
        const noteDocRef = doc(dataFire, 'notes', noteId);
        await deleteDoc(noteDocRef);
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await deleteNote(noteId); 
            fetchNotes(); 
        } catch (error) {
            setErrorMessage('Error deleting note');
        }
    };

   // Handle pull-to-refresh
   const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await fetchNotes();
        event.detail.complete();
    };

    // Handle modal dismiss and ensure keyboard is hidden
    const handleModalDismiss = () => {
        Keyboard.hide(); // Manually hide the keyboard
        setShowModal(false);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Personal Notes</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'} className='ion-padding'>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                {/* Input to Add a New Note */}
                <IonItem color={'dark'}>
                    <IonLabel position="stacked">Note</IonLabel>
                    <IonTextarea
                        value={note}
                        placeholder="Enter your note here..."
                        onIonChange={(e: { detail: { value: React.SetStateAction<string>; }; }) => setNote(e.detail.value!)}
                    />
                </IonItem>
                <IonButton expand="block" color={'primary'} onClick={handleSaveNote}>
                    Save Note
                </IonButton>

                {/* Error Message Display */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                {/* Notes List */}
                <IonGrid color='dark'>
                    <IonCol color='dark'>
                        <IonCard color='dark'>
                            {notes.map((noteItem) => (
                                <IonItem key={noteItem.id} color='dark'>
                                    {noteItem.note}
                                    <IonButton fill="clear" slot="end" color='danger' onClick={() => handleDeleteNote(noteItem.id)}>
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonCard>
                    </IonCol>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Notes;
