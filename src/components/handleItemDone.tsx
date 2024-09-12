import {  getDoc, updateDoc, doc } from 'firebase/firestore';
import { dataFire } from '../pages/FirebaseConfig';

export const handleItemDone = async (
  itemId: string, 
  isDone: boolean, 
  type: string, 
  featureIndex: number | undefined, 
  setItems: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    const eventDoc = doc(dataFire, 'events', itemId);

    // Get the current data for the event
    const eventSnapshot = await getDoc(eventDoc);
    if (!eventSnapshot.exists()) {
      console.error('Event not found');
      return;
    }

    const eventData = eventSnapshot.data();

    // Create a new field for tracking the "completed" state, like 'isCompleted'
    const updates: any = {};

    // Update for "In" type
    if (type === 'Check-In') {
      updates.assignedToInDone = isDone;  // Set 'assignedToInDone' to the checkbox state
    }
    // Update for "Out" type
    else if (type === 'Check-Out') {
      updates.assignedToOutDone = isDone; // Set 'assignedToOutDone' to the checkbox state
    }
    // Update for Extra Features
    else if (type === 'Extra' && featureIndex !== undefined) {
      if (Array.isArray(eventData.extraFeatures)) {
        const updatedFeatures = [...eventData.extraFeatures];
        updatedFeatures[featureIndex].done = isDone;
        updates.extraFeatures = updatedFeatures;
      }
    }

    // Add the new boolean field 'isCompleted' based on the checkbox state
    updates.isCompleted = isDone;

    // Update the document with the new data and the new boolean field
    await updateDoc(eventDoc, updates);

    // Update the state in the parent component to reflect the change in UI
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.type === type && item.featureIndex === featureIndex
          ? { ...item, isDone }
          : item
      )
    );
  } catch (error) {
    console.error('Error updating item status:', error);
  }
};
