import { collection, setDoc, getDocs, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig'
import { onSnapshot } from 'firebase/firestore';
import moment from 'moment';

export interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  assignedToIn?: string;
  assignedToOut?: string;
  extraFeatures: { title: string; date: string; assignedTo: string[] }[]; 
}

const eventsCollectionRef = collection(dataFire, 'events');
const usersCollectionRef = collection(dataFire, 'users');

export const addEvent = async (event: Event): Promise<void> => {
  const formattedDate = moment(event.start).format('DDMMYYYY')
  const eventId = `${event.title.replace(/\s+/g, 
    '_')}_${formattedDate}`;
  const eventRef = doc(eventsCollectionRef, eventId);
  const eventData = { ...event, id: eventId }; // Ensure the eventData does not include root-level assignedTo
  await setDoc(eventRef, eventData);
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const querySnapshot = await getDocs(eventsCollectionRef);
    const events: Event[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        title: data.title,
        start: data.start.toDate ? data.start.toDate() : new Date(data.start),
        end: data.end.toDate ? data.end.toDate() : new Date(data.end),
        assignedToIn: data.assignedToIn,
        assignedToOut: data.assignedToOut,
        assignedTo: data.assignedTo,
        extraFeatures: data.extraFeatures
      } as Event;
    });
    return events;
  } catch (error) {
    console.error('Error getting events: ', error);
    return [];
  }
};

export const updateEvent = async (event: Event) => {
  try {
    if (!event.id) {
      throw new Error('Event ID is required for update');
    }
    const eventDoc = doc(eventsCollectionRef, event.id);
    await updateDoc(eventDoc, {
      title: event.title,
      start: event.start,
      end: event.end,
      assignedToIn: event.assignedToIn,
      assignedToOut: event.assignedToOut,
      extraFeatures: event.extraFeatures
    });
  } catch (error) {
    console.error('Error updating event: ', error);
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    if (!eventId) {
      throw new Error('Event ID is required for deletion');
    }
    const eventDoc = doc(eventsCollectionRef, eventId);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error('Error deleting event: ', error);
  }
};

export const getUsers = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(usersCollectionRef);
    const users: any[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return users;
  } catch (error) {
    console.error('Error getting users: ', error);
    return [];
  }
};

export const getTodosForUser = async (userId: string): Promise<any[]> => {
  try {
    const userDocRef = doc(usersCollectionRef, userId);
    const todosCollectionRef = collection(userDocRef, 'todos');
    const querySnapshot = await getDocs(todosCollectionRef);
    const todos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return todos;
  } catch (error) {
    console.error('Error getting todos for user: ', error);
    return [];
  }
};

export const getEventsRealtime = (callback: (events: Event[]) => void) => {
  onSnapshot(eventsCollectionRef, (querySnapshot) => {
    const events: Event[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        title: data.title,
        start: data.start.toDate ? data.start.toDate() : new Date(data.start),
        end: data.end.toDate ? data.end.toDate() : new Date(data.end),
        assignedToIn: data.assignedToIn,
        assignedToOut: data.assignedToOut,
        extraFeatures: data.extraFeatures
      } as Event;
    });
    callback(events);
  }, (error) => {
    console.error('Error getting events: ', error);
  });
};


