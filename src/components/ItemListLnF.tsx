//Lost And Found
//DeleteItemLnF, ItemAddLnF, ItemDetailLnF, ItemListLnF

import React from 'react';
import { IonGrid, IonCol, IonItem, IonLabel, IonCheckbox, IonButton, IonIcon, IonButtons } from '@ionic/react';
import { informationCircleOutline, trashOutline } from 'ionicons/icons';
import { useAuth } from './AuthContext';

interface ItemListProps {
    items: { id: string; title: string; who: string; wher: string; when: string; received: boolean }[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    onShowDetails: (item: { title: string; who: string; wher: string; when: string }) => void;
    onDeleteItem: (id: string) => void;
   
}

const ItemList: React.FC<ItemListProps> = ({ items, onCheckboxChange, onShowDetails, onDeleteItem }) => {
    const { role } = useAuth();
    
    return (
        <IonGrid>
            <IonCol>
                {items.map((item) => (
                    <IonCol key={item.id}>
                        <IonItem color={item.received ? 'success' : 'dark'}>
                            {item.title}
                            <IonButtons slot="end">
                                <IonButton onClick={() => onShowDetails(item)}>
                                    <IonIcon color="primary" icon={informationCircleOutline} />
                                </IonButton>
                                {role === 'Admin' && (
                                <IonButton onClick={() => onDeleteItem(item.id)}>
                                    <IonIcon color='danger' icon={trashOutline} />
                                </IonButton>
                                )}
                            </IonButtons>
                            {role === 'Admin' && (
                            <IonCheckbox
                                slot="start"
                                checked={item.received}
                                onIonChange={(e) => onCheckboxChange(item.id, e.detail.checked)}
                            />
                            )}
                        </IonItem>
                    </IonCol>
                ))}
            </IonCol>
        </IonGrid>
    );
};

export default ItemList;
