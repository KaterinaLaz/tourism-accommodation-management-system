//DeleteItemLnF, ItemAddLnF, ItemDetailLnF, ItemListLnF

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSearchbar, IonFab, IonFabButton, IonIcon, IonToast, IonLoading } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { dataFire } from './FirebaseConfig';
import ItemList from '../components/ItemListLnF';
import ItemDetailModal from '../components/ItemDetailLnF';
import AddItemModal from '../components/ItemAddLnF';
import DeleteConfirmationAlert from '../components/DeleteItemLnF';
import { getAuth } from '@firebase/auth';

const LostFound: React.FC = () => {
    // State for items, search, and filtering
    const [items, setItems] = useState<{ id: string; title: string; who: string; wher: string; when: string; received: boolean }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<{ id: string; title: string; who: string; wher: string; when: string; received: boolean }[]>([]);

    // State for modals and alerts
    const [selectedItem, setSelectedItem] = useState<{ title: string; who: string; wher: string; when: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showMAdd, setShowMAdd] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // State for loading and toast messages
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Fetch items from Firestore
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(dataFire, 'lost-found'));
                const allItems = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    who: doc.data().who || 'Unknown',
                    wher: doc.data().wher || 'Unknown Location',
                    when: doc.data().when.toDate().toLocaleString(),
                    received: doc.data().received || false,
                }));
                setItems(allItems);
                setFilteredItems(allItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    // Filter items based on search term
    useEffect(() => {
        const filtered = items.filter(
            (item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.who.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.wher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.when.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchTerm, items]);

    // Handle checkbox change for marking an item as received
    const handleCheckboxChange = async (itemId: string, newValue: boolean) => {
        try {
            const itemDocRef = doc(dataFire, 'lost-found', itemId);
            await updateDoc(itemDocRef, { received: newValue });
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, received: newValue } : item
                )
            );
            setFilteredItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, received: newValue } : item
                )
            );
        } catch (error) {
            console.error('Error updating received status:', error);
        }
    };

    // Handle adding a new item
    const handleAddItem = async (newItem: { title: string; who: string; wher: string; when: string }) => {
        setLoading(true);
        setMessage('');
        try {
            await addDoc(collection(dataFire, 'lost-found'), {
                ...newItem,
                when: new Date(newItem.when),
                received: false,
            });
            setItems(prevItems => [...prevItems, { ...newItem, received: false, id: new Date().toISOString(), when: new Date(newItem.when).toLocaleString() }]);
            setFilteredItems(prevItems => [...prevItems, { ...newItem, received: false, id: new Date().toISOString(), when: new Date(newItem.when).toLocaleString() }]);
            setShowMAdd(false);
            setMessage('Item added successfully');
        } catch (error) {
            console.error('Error adding item:', error);
            setMessage('Error adding item');
        } finally {
            setLoading(false);
            setShowToast(true);
        }
    };

    // Handle showing details of an item
    const handleShowDetails = (item: { title: string; who: string; wher: string; when: string }) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Handle delete item
    const handleDeleteItem = (id: string) => {
        setItemToDelete(id);
        setShowDeleteAlert(true);
    };

    // Confirm delete item
    const confirmDeleteItem = async () => {
        if (itemToDelete) {
            try {
                await deleteDoc(doc(dataFire, 'lost-found', itemToDelete));
                setItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete));
                setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete));
                setMessage('Item deleted successfully');
            } catch (error) {
                console.error('Error deleting item:', error);
                setMessage('Error deleting item');
            } finally {
                setItemToDelete(null);
                setShowDeleteAlert(false);
                setShowToast(true);
            }
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Lost and Found</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light" className='ion-padding'>
                <IonSearchbar
                    color="dark"
                    value={searchTerm}
                    onIonChange={(e) => setSearchTerm(e.detail.value!)}
                    placeholder="Search for items..."
                />

                {/* Item List */}
                <ItemList
                    items={filteredItems}
                    onCheckboxChange={handleCheckboxChange}
                    onShowDetails={handleShowDetails}
                    onDeleteItem={handleDeleteItem}
                    
                />

                {/* Item Detail Modal */}
                <ItemDetailModal
                    isOpen={showModal}
                    onDidDismiss={() => setShowModal(false)}
                    item={selectedItem}
                />

                {/* Add Item Modal */}
                <AddItemModal
                    isOpen={showMAdd}
                    onDidDismiss={() => setShowMAdd(false)}
                    onAddItem={handleAddItem}
                />

                {/* Delete Confirmation Alert */}
                <DeleteConfirmationAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    onConfirm={confirmDeleteItem}
                />

                <IonFab horizontal="end" vertical="bottom">
                    <IonFabButton color="secondary" onClick={() => setShowMAdd(true)}>
                        <IonIcon icon={addCircleOutline} />
                    </IonFabButton>
                </IonFab>

                <IonLoading isOpen={loading} message="Please wait..." />
                <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={message} duration={2000} />
            </IonContent>
        </IonPage>
    );
};

export default LostFound;
