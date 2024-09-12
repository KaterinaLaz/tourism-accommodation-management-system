//Lost And Found
//DeleteItemLnF, ItemAddLnF, ItemDetailLnF, ItemListLnF

import React from 'react';
import { IonAlert } from '@ionic/react';

interface DeleteConfirmationAlertProps {
    isOpen: boolean;
    onDidDismiss: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationAlert: React.FC<DeleteConfirmationAlertProps> = ({ isOpen, onDidDismiss, onConfirm }) => {
    return (
        <IonAlert
            isOpen={isOpen}
            onDidDismiss={onDidDismiss}
            header="Delete"
            message="Are you sure you want to delete this item?"
            buttons={[
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: onDidDismiss,
                },
                {
                    text: 'Delete',
                    handler: onConfirm,
                    
                },
            ]}
        />
    );
};

export default DeleteConfirmationAlert;
