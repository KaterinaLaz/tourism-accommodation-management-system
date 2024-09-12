//Lost And Found
//DeleteItemLnF, ItemAddLnF, ItemDetailLnF, ItemListLnF

import React from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonGrid, IonItem, IonLabel } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

interface ItemDetailModalProps {
    isOpen: boolean;
    onDidDismiss: () => void;
    item: { title: string; who: string; wher: string; when: string } | null;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onDidDismiss, item }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle>Item Details</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDidDismiss}>
                            <IonIcon icon={closeCircleOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {item && (
                    <IonGrid>
                        <IonItem color="dark">
                            <IonLabel>
                                Description: {item.title}
                            </IonLabel>
                        </IonItem>
                        <IonItem color="dark">
                            <IonLabel>
                                Where: {item.wher}
                            </IonLabel>
                            <IonLabel>
                                <p>Found by: {item.who}</p>
                                <p>When: {item.when}</p>
                            </IonLabel>
                        </IonItem>
                    </IonGrid>
                )}
            </IonContent>
        </IonModal>
    );
};

export default ItemDetailModal;
