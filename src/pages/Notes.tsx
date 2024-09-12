import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonItem, IonLabel,
    IonTextarea, IonButton, IonList,
    IonCard,
    IonGrid,
    IonCol,
    IonIcon
} from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';
import { trashOutline } from 'ionicons/icons';

const Notes: React.FC = () => {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState<{ note: string; id: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const saveNote = async (noteData: { note: string }) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            const notesCollection = collection(dataFire, 'notes');
            await addDoc(notesCollection, {
                ...noteData,
                userId: user.uid, // Associate the note with the user's UID
                createdAt: new Date()
            });
        } else {
            throw new Error("User not authenticated");
        }
    };
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
                const userNotes = await getNotesForUser(user.uid); // Fetch notes for the current user
                setNotes(userNotes);
            } else {
                setErrorMessage('User not authenticated');
            }
        } catch (error) {
            setErrorMessage('Error fetching notes');
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSaveNote = async () => {
        if (note) {
            try {
                await saveNote({ note });
                setNote(''); // Clear the note input after saving
                fetchNotes(); // Refresh notes after saving
            } catch (error) {
                setErrorMessage('Error saving note');
            }
        } else {
            setErrorMessage('Please enter a note.');
        }
    };
    // Function to delete a note by its ID
    const deleteNote = async (noteId: string) => {
        const noteDocRef = doc(dataFire, 'notes', noteId);
        await deleteDoc(noteDocRef);
    };
    const handleDeleteNote = async (noteId: string) => {
        try {
            await deleteNote(noteId); // Delete the note from Firestore
            fetchNotes(); // Refresh the notes list after deletion
        } catch (error) {
            setErrorMessage('Error deleting note');
        }
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
                <IonItem color={'dark'}>
                    <IonLabel position="stacked">Note</IonLabel>
                    <IonTextarea
                        value={note}
                        placeholder="Enter your note here..."
                        onIonChange={(e) => setNote(e.detail.value!)}
                    />
                </IonItem>
                <IonButton expand="block" color={'primary'}  onClick={handleSaveNote}>
                    Save Note
                </IonButton>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
