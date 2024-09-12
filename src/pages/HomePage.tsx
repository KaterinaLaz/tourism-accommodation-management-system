import React, { useState, useRef, useEffect } from 'react';
import {
  IonApp, IonContent, IonButton, IonItem, IonLabel, IonInput, IonModal, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCol, IonGrid, IonRow, IonButtons, IonMenuButton, IonPage, IonDatetime, IonSelect, IonSelectOption,
  IonFab,IonFabButton,IonIcon, } from '@ionic/react';
import { Calendar, DateRangeFormatFunction, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { getEvents, addEvent, updateEvent, deleteEvent, getUsers } from './firebaseFunctions';
import './home.css';
import {addCircleOutline} from 'ionicons/icons'
import { useAuth } from '../components/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { dataFire } from './FirebaseConfig';

export interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  realtyId?: string;
  assignedToIn?: string;
  assignedToOut?: string;
  extraFeatures: { title: string; date: string; assignedTo: string[] }[]; 
}

const localizer = momentLocalizer(moment);

const formats = {
  agendaHeaderFormat: ((range: { start: Date; end: Date }, culture: string, localizer: any) => {
    const start = localizer ? localizer.format(range.start, 'DD-MM-YYYY', culture) : range.start.toLocaleDateString();
    const end = localizer ? localizer.format(range.end, 'DD-MM-YYYY', culture) : range.end.toLocaleDateString();
    return `${start} – ${end}`;
  }) as DateRangeFormatFunction,
};

const Home: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());
  const [assignedToIn, setAssignedToIn] = useState<string>('');
  const [assignedToOut, setAssignedToOut] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('')
  const [extraFeatures, setExtraFeatures] = useState<{ title: string; date: string; assignedTo: string[] }[]>([])
  const { role } = useAuth()
  const [realtyId, setRealtyId] = useState<string>('');
  const [realtyList, setRealtyList] = useState<any[]>([]);

  const isEditable = role === 'Admin';

  // Fetch the list of realty (properties) from Firestore
  useEffect(() => {
    const fetchRealty = async () => {
      const realtySnapshot = await getDocs(collection(dataFire, 'realty')); // Change 'realty' to your collection name
      const realtyData = realtySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRealtyList(realtyData); // Store the list of properties
    };

    fetchRealty();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchEvents().catch(error => console.error('Error fetching events:', error));
    fetchUsers().catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSaveEvent = async () => {
    
    if (role !== 'Admin') {
      setErrorMessage("You don't have permission to perform this action.");
      return;
    }
    
    if (!title || !startDate || !endDate ) {
      setErrorMessage('Title, start date, and end date are required');
      return;
    }

  
    const newEvent: Event = {
      id: selectedEvent?.id || undefined,
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      realtyId,
      assignedToIn,
      assignedToOut,
      extraFeatures
    };
  
    try {
      if (selectedEvent && selectedEvent.id) {
        // Update the existing event in Firebase
        await updateEvent(newEvent);
  
        // Update the event in the local state
        setEvents(prevEvents => prevEvents.map(event =>
          event.id === newEvent.id ? newEvent : event
        ))
      } else {
         // Add a new event if no ID exists (this should only happen when creating a new event)
         await addEvent(newEvent);
         setEvents([...events, newEvent]);
      }
      resetForm(); // Reset the form after saving
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage('Error saving event: ' + error.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };

  const handleAddFeature = () => {
    setExtraFeatures([...extraFeatures, { title: '', date: new Date().toISOString(), assignedTo: [] }]);
  };

  const handleFeatureChange = (index: number, field: string, value: string | string[]) => {
    const updatedFeatures = [...extraFeatures];
    
    if (field === 'assignedTo') {
      updatedFeatures[index] = { ...updatedFeatures[index], assignedTo: Array.isArray(value) ? value : [value] };
    } else {
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    }
    
    setExtraFeatures(updatedFeatures);
  };
  

  const handleEventSelect = (event: Event) => {
    if (role !== 'Admin') {
      alert("You don't have permission to edit this event.");
      return; 
    }
      setSelectedEvent(event);
      setTitle(event.title);
      setStartDate(new Date(event.start).toISOString());
      setEndDate(new Date(event.end).toISOString());
      setAssignedToIn(event.assignedToIn || '');
      setAssignedToOut(event.assignedToOut || '');
      setExtraFeatures(event.extraFeatures || [])
      setRealtyId(event.realtyId || '');
      setShowModal(true);
  };
  
  

  const handleDateClick = (date: Date) => {
    if (role !== 'Admin') {
      alert("You don't have permission to create an event.");
      return;  // Ακύρωση ανοίγματος του modal για μη Admin χρήστες
    }
    setSelectedEvent(null);
    setTitle('');
    setStartDate(date.toISOString());
    setEndDate(date.toISOString());
    setAssignedToIn('');
    setAssignedToOut('');
    setShowModal(true);
    setRealtyId('')
  };

  const handleDeleteEvent = async () => {
    if (role !== 'Admin') {
      setErrorMessage("You don't have permission to delete this event.");
      return;
    }

    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteEvent(selectedEvent.id);
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        resetForm();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setTitle('');
    setStartDate(new Date().toISOString());
    setEndDate(new Date().toISOString());
    setAssignedToIn('');
    setAssignedToOut('');
    setExtraFeatures([]);
    setRealtyId('')
    setShowModal(false);
  };
  
  const handleModalDismiss = () => {
    
      setShowModal(false);
      resetForm();
    
    
  };



  const handleDeleteFeature = async (index: number) => {
    // Create a new array without the feature at the given index
    const updatedFeatures = extraFeatures.filter((_, i) => i !== index);
    setExtraFeatures(updatedFeatures);
  
    if (selectedEvent && selectedEvent.id) {
      // Update Firestore to remove the feature
      const updatedEvent: Event = {
        ...selectedEvent,
        extraFeatures: updatedFeatures,
      };
  
      try {
        await updateEvent(updatedEvent); // Update the event in Firestore
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event)); // Update local state
      } catch (error) {
        setErrorMessage('Error updating event: ' + error);
      }
    }
  };

  return (
    <IonApp>
      <IonPage>

        <IonHeader>
          <IonToolbar color="secondary">
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent color={'light'} className="ion-padding">
          <div style={{ height: '700', color: 'darkblue' }}>
            <Calendar
              
              localizer={localizer}
              events={events.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              formats={formats}
              selectable
              onSelectSlot={slotInfo => handleDateClick(slotInfo.start)}
              onSelectEvent={event => handleEventSelect(event as Event)}
            />
          </div>

      
          <IonModal isOpen={showModal} ref={modal} onDidDismiss={handleModalDismiss}>
            <IonHeader>
              <IonToolbar color={'dark'}>
                <IonTitle>{selectedEvent ? 'Edit' : 'Add'}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
            <IonGrid>
              <IonCard  color={'dark'}>
                <IonItem color={'dark'}>
                  <IonLabel position="stacked">Event</IonLabel>
                  <IonInput value={title} placeholder="House Name" onIonChange={e => setTitle(e.detail.value!)} />
                </IonItem>
                <IonItem color={'dark'}>
          <IonLabel position="stacked">Select Realty (Property)</IonLabel>
          <IonSelect
            value={realtyId}
            placeholder="Select realty"
            onIonChange={(e) => setRealtyId(e.detail.value)}
          >
            {realtyList.map((realty) => (
              <IonSelectOption key={realty.id} value={realty.id}>
                {realty.id }
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
                <IonRow color={'dark'}>
                  <IonCol size='6'>
                    <IonItem color={'dark'}>
                      <IonLabel position="stacked">Chack-in Date</IonLabel>
                      <IonInput
                        value={new Date(startDate).toLocaleString()}
                        readonly
                        onClick={() => setShowStartDatePicker(true)}
                      />
                    </IonItem>
                  </IonCol >
                  <IonCol size='6' color={'dark'}>
                    <IonItem color={'dark'}>
                      <IonLabel>Assign to</IonLabel>
                        <IonSelect multiple={true}  value={assignedToIn} placeholder="Select User" onIonChange={e => setAssignedToIn(e.detail.value)}>
                          {users.map(user => (
                            <IonSelectOption key={user.id} value={user.id}>
                              {user.fullname}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='6'>
                    <IonItem color={'dark'}>
                      <IonLabel position="stacked">Check-out Date</IonLabel>
                      <IonInput
                        value={new Date(endDate).toLocaleString()}
                        readonly
                        onClick={() => setShowEndDatePicker(true)}
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size='6'>
                    <IonItem color={'dark'}>
                      <IonLabel>Assign to</IonLabel>
                      <IonSelect   multiple={true}  value={assignedToOut} placeholder="Select User" onIonChange={e => setAssignedToOut(e.detail.value)}>
                        {users.map(user => (
                          <IonSelectOption key={user.id} value={user.id}>
                            {user.fullname}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonCard>
              </IonGrid>
              
              <IonGrid>
                  {extraFeatures.map((feature, index) => (
                    <IonCard key={index} color={'dark'}>
                      <IonItem color={'dark'}>
                        <IonLabel position="floating">Linen change or cleanin </IonLabel>
                        <IonInput value={feature.title} onIonChange={e => handleFeatureChange(index, 'title', e.detail.value!)} />
                      </IonItem>

                      
                        <IonItem color={'dark'}>
                          <IonDatetime presentation="date" value={feature.date} onIonChange={e => handleFeatureChange(index, 'date', e.detail.value!)} />
                        </IonItem>
                     

                      
                        <IonItem color={'dark'}>
                          <IonLabel>Assign to</IonLabel>
                          <IonSelect multiple={true} value={feature.assignedTo} placeholder="Select User" onIonChange={e => handleFeatureChange(index, 'assignedTo', e.detail.value!)}>
                            {users.map(user => (
                              <IonSelectOption key={user.id} value={user.id}>
                                {user.fullname}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                        <IonButton fill='outline' shape="round" expand="block" color={'danger'} onClick={() => handleDeleteFeature(index)}>
                          Delete Feature
                        </IonButton>
                  </IonCard>  
                  ))}
              </IonGrid>

              <IonGrid>
                <IonRow>
                  <IonCol size='6'>
                    <IonButton shape="round" className='ion-margin-top' expand="block" onClick={handleSaveEvent} color={'secondary'} disabled={role !== 'Admin'}>
                      {selectedEvent ? 'Update' : 'Add a Booking'}
                    </IonButton>
                  </IonCol>
                  <IonCol size='6'>
                    <IonButton className='ion-margin-top' shape="round" expand="block" color={'secondary'} fill="outline" onClick={resetForm}>
                      Cancel
                    </IonButton>
                  </IonCol>
                </IonRow>
                {selectedEvent && (
                  <IonRow>
                    <IonCol>
                      <IonButton className='ion-margin-top' shape="round" expand="block" color={'danger'} onClick={handleDeleteEvent} disabled={role !== 'Admin'}>
                        Delete
                      </IonButton>
                    </IonCol>
                  </IonRow>
                )}
              </IonGrid>
              <IonFab horizontal='end' vertical='bottom'  >
                    <IonFabButton onClick={handleAddFeature} color="secondary">
                        <IonIcon icon={addCircleOutline}></IonIcon>
                    </IonFabButton>
                </IonFab>
                
            </IonContent>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
          </IonModal>
          
          {/* Modal start event */}
          <IonModal isOpen={showStartDatePicker} onDidDismiss={() => setShowStartDatePicker(false)}>
            <IonDatetime
              presentation="date-time"
              value={startDate}
              onIonChange={e => {
                if (typeof e.detail.value === 'string') {
                  setStartDate(e.detail.value);
                }
                setShowStartDatePicker(false);
              }}
            />
            <IonButton shape="round" fill="outline" color={'primary'} expand="block" onClick={() => setShowStartDatePicker(false)}>Close</IonButton>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
          </IonModal>
         

          {/* Modal end event */}
          <IonModal isOpen={showEndDatePicker} onDidDismiss={() => setShowEndDatePicker(false)}>
            <IonContent className='modal-end'>
              <IonDatetime
                presentation="date-time"
                value={endDate}
                onIonChange={e => {
                  if (typeof e.detail.value === 'string') {
                    setEndDate(e.detail.value);
                  }
                  setShowEndDatePicker(false);
                }}
              />
              <IonButton shape="round" fill="outline" color={'primary'} expand="block" onClick={() => setShowEndDatePicker(false)}>Close</IonButton>
            </IonContent>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
          </IonModal>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default Home;
