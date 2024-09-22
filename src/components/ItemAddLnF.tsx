//Lost And Found
//DeleteItemLnF, ItemAddLnF, ItemDetailLnF, ItemListLnF

import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonGrid, IonCol, IonCard, IonCardContent, IonItem, IonLabel, IonInput } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

interface AddItemModalProps {
    isOpen: boolean;
    onDidDismiss: () => void;
    onAddItem: (item: { title: string; who: string; wher: string; when: string }) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onDidDismiss, onAddItem }) => {
    const [newItem, setNewItem] = useState({ title: '', who: '', wher: '', when: '' });

    const handleAddItem = () => {
        onAddItem(newItem);
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle>Add a Lost & Found</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDidDismiss}>
                            <IonIcon icon={closeCircleOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonCol>
                        <IonCard color="light">
                            <IonCardContent>
                                <IonItem color="dark">
                                    <IonLabel position="stacked">Title</IonLabel>
                                    <IonInput value={newItem.title} onIonChange={(e: { detail: { value: string; }; }) => setNewItem({ ...newItem, title: e.detail.value! })} />
                                </IonItem>
                                <IonItem color="dark">
                                    <IonLabel position="stacked">Who found it?</IonLabel>
                                    <IonInput value={newItem.who} onIonChange={(e: { detail: { value: string; }; }) => setNewItem({ ...newItem, who: e.detail.value! })} />
                                </IonItem>
                                <IonItem color="dark">
                                    <IonLabel position="stacked">Where was it found?</IonLabel>
                                    <IonInput value={newItem.wher} onIonChange={(e: { detail: { value: string; }; }) => setNewItem({ ...newItem, wher: e.detail.value! })} />
                                </IonItem>
                                <IonItem color="dark">
                                    <IonLabel position="stacked">When was it found?</IonLabel>
                                    <IonInput type="date" value={newItem.when} onIonChange={(e: { detail: { value: string; }; }) => setNewItem({ ...newItem, when: e.detail.value! })} />
                                </IonItem>
                                <IonButton color="primary" style={{ padding: '16px' }} expand="full" onClick={handleAddItem}>Add Item</IonButton>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonGrid>
            </IonContent>
        </IonModal>
    );
};

export default AddItemModal;
