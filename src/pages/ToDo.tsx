import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonCard, IonItem, IonLabel, IonCheckbox, IonMenuButton, IonIcon, IonButton, IonFab, IonFabButton, IonButtons } from '@ionic/react';
import { handleItemDone } from '../components/handleItemDone'; 
import { collection, getDocs } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';
import { isEventDone } from '../components/isEventDone';
import useUserId from '../components/useUserId';
import { exportEvents } from '../components/exportEvents';
import { cloudDownloadOutline } from 'ionicons/icons';

const Todo: React.FC = () => {
    const [items, setItems] = useState<{realtyId?: string; id: string; title: string; type: string; date: string; isDone: boolean; featureIndex?: number  }[]>([]);
    const [events, setEvents] = useState<{ realtyId?: string; title: string; type: string; date: string; status: string }[]>([]); // Store events for export
    const [loading, setLoading] = useState(true);
    const userId = useUserId(); // Use the custom hook to get the user ID
    

    useEffect(() => {
      if (!userId) return;
    
      const fetchItems = async () => {
        setItems([]); // Reset items before fetching
        setEvents([]); // Reset events for export
    
        try {
          const querySnapshot = await getDocs(collection(dataFire, 'events'));
          let allItems: React.SetStateAction<{ realtyId?: string; id: string; title: string; type: string; date: string; isDone: boolean; featureIndex?: number; }[]> | { id: string; title: any; realtyId?: any; type: string; date: any; isDone: any; featureIndex?: number; }[] = [];
          let eventsForExport: React.SetStateAction<{ realtyId?: string; title: string; type: string; date: string; status: string }[]> | { title: any; type: string; date: any; status: string; }[] = [];
    
          querySnapshot.docs.forEach(doc => {
            const data = doc.data();
    
            const eventTitle = data.title || 'No Title';
            const eventId = doc.id;
            const realtyId = data.realtyId || ' ';
            const assignedToOutDone = data.assignedToOutDone || false;
            const assignedToInDone = data.assignedToInDone || false;
            const isCompleted = data.isCompleted || false;
    
            // Check-in events
            if (Array.isArray(data.assignedToIn) && data.assignedToIn.includes(userId)) {
              const checkInDate = data.start ? data.start.toDate() : null;
    
              // Εμφάνιση μόνο αν δεν είναι done
              if (!data.assignedToInDone) {
                allItems.push({
                  id: eventId,
                  title: `${eventTitle} - ${realtyId}`,
                  realtyId: realtyId,
                  type: 'Check-In',
                  date: checkInDate ? checkInDate.toISOString() : 'No Date',
                  isDone: data.assignedToInDone || false,
                });
              }
    
              // Για το CSV εξάγουμε όλα τα events, done και not done
              eventsForExport.push({
                title: eventTitle,
                type: 'Check-In',
                date: checkInDate ? checkInDate.toISOString() : 'No Date',
                status: assignedToInDone ? 'Done' : 'Not Done',
              });
            }
    
            // Check-out events
            if (Array.isArray(data.assignedToOut) && data.assignedToOut.includes(userId)) {
              const checkOutDate = data.end ? data.end.toDate() : null;
    
              // Εμφάνιση μόνο αν δεν είναι done
              if (!data.assignedToOutDone) {
                allItems.push({
                  id: eventId,
                  title: `${eventTitle} - ${realtyId}`,
                  realtyId: realtyId,
                  type: 'Check-Out',
                  date: checkOutDate ? checkOutDate.toISOString() : 'No Date',
                  isDone: data.assignedToOutDone || false,
                });
              }
    
              // Για το CSV εξάγουμε όλα τα events, done και not done
              eventsForExport.push({
                title: eventTitle,
                type: 'Check-Out',
                date: checkOutDate ? checkOutDate.toISOString() : 'No Date',
                status: assignedToOutDone ? 'Done' : 'Not Done',
              });
            }
    
            // Extra features
            if (Array.isArray(data.extraFeatures)) {
              const userFeatures = data.extraFeatures.filter((feature) => feature.assignedTo && feature.assignedTo.includes(userId));
              userFeatures.forEach((feature, index) => {
                const featureDate = feature.date ? new Date(feature.date) : null;
    
                // Εμφάνιση μόνο αν δεν είναι done
                if (!feature.done) {
                  allItems.push({
                    id: eventId,
                    title: feature.title || 'No Title',
                    type: 'Extra',
                    date: featureDate ? featureDate.toISOString() : 'No Date',
                    isDone: feature.done || false,
                    featureIndex: index,
                  });
                }
    
                // Για το CSV εξάγουμε όλα τα features, done και not done
                eventsForExport.push({
                  title: `${eventTitle} - ${feature.title}`,
                  type: 'Extra',
                  date: feature.date || 'No Date',
                  status: isCompleted ? 'Done' : 'Not Done',
                });
              });
            }
          });
    
          // Sort items by date in descending order
          allItems.sort((a, b) => {
            if (a.date === 'No Date') return 1;
            if (b.date === 'No Date') return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
    
          setItems(allItems);
          setEvents(eventsForExport); // Set events for export
        } catch (error) {
          console.error('Error fetching items:', error);
        } finally {
          setLoading(false);
        }
      };

      //
    
      fetchItems();
    }, [userId]);
    
    const handleExport = () => {
      const exportData = events.map(({ title, type, date, status }) => ({
        title,
        type,
        date: new Date(date).toLocaleDateString(),
        status
      }));
    
      exportEvents(exportData, 'events.csv');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'secondary'}>
                    <IonMenuButton slot="start" />
                    <IonTitle>Todo</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleExport}>
                            <IonIcon slot="icon-only" icon={cloudDownloadOutline} ></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
                {items.length === 0 && <IonText>No items found for this user.</IonText>}
                {items.map((item, index) => (
                  <IonCard key={index}>
                    <IonItem color={'dark'}>
                      <IonLabel onClick={() => handleItemDone(item.id, true, item.type, item.featureIndex, setItems)}>
                        <h2>
                          {item.type === 'Extra' && item.featureIndex !== undefined
                            ? `${item.title || 'No Title'}`
                            : item.title}
                        </h2>
                        <p>Type: {item.type}</p>
                        <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                      </IonLabel>
                      <IonCheckbox
                        checked={item.isDone}
                        onIonChange={() => handleItemDone(item.id, !item.isDone, item.type, item.featureIndex, setItems)}
                      />
                    </IonItem>
                  </IonCard>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default Todo;
