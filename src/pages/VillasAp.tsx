import { IonAlert, IonButton, IonButtons, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton,IonModal, IonPage,  IonRouterOutlet,  IonText,  IonTitle, IonToolbar, IonicSlides } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import {auth, dataFire} from './FirebaseConfig'
import {  collection, getDocs, deleteDoc, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'
import { saveOutline, closeCircleOutline, flowerOutline, addCircleOutline, trashOutline, informationCircleOutline, bedOutline} from 'ionicons/icons'
import './VillasAp.css'
import { useLocation } from 'react-router'


interface Villa {
    id: string
    Location: string
    IndoorSpase: string
    OutdoorSpase: string
    Levels: string
    Rooms: string
    Bathroom: string
    Kitchen: string
    Barbecue: string
    Sauna: string
    Wc: string
    SingleBed: string
    DoubleBed: string
    ChekinDay: string
    Office: string
    OfficeName: string
    Planting: string
    FurnitureOut: string
    BroomOut: string
}

interface Linen {
    id: string
    LaundryName: string
    DoubleBedSheets: string
    SingleBedSheets: string
    PillowCases: string
    BigTowels: string
    SmallTowels: string
    Coverlets: string
    FittedSheets: string
    QuiltedPillowCasee: string
    HandTowels: string
    Robe: string
    PoolTowels: string
}

const VillasAp: React.FC = () => {
    
    const modal = useRef<HTMLIonModalElement>(null)

    //[] as any  or  <any[]>   => error: Type 'never[]' is not assignable to type 'string'
    const [villaAp, setVillaAp]= useState<any[]>([])
    const [selectVillaAp, setSelectVillaAp] =useState([] as any)
    const [villaLinen, setVillaLinen]= useState<any[]>([])
    const [selectVillaLinen, setSelectVillaLinen] =useState([] as any)
    const [editForm, setEditForm] =  useState<Partial<Villa>>({})
    const [editLinenForm, setEditLinenForm] = useState<Partial<Linen>>({})
    
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [villaToDelete, setVillaToDelete] = useState<string | null>(null);

    const [role, setRole] = useState<string | null>(null);

    //to open modal screen for apartment ditails
    const [showmodal, setModal] = useState(false)
    //to open modal screen for linen ditails
    const [showmodalLinen, setModalLinen] = useState(false)

    const location = useLocation(); 

    useEffect(() => {
        const fetchUserRole = async () => {
            // Assuming you have the user's ID available (from auth state)
            const userId = auth.currentUser?.uid; // Adjust this if you're using a custom auth hook
            if (userId) {
                const userDocRef = doc(dataFire, "users", userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setRole(userData.role); // Assuming role is stored in Firestore as 'role'
                }
            }
        };
        
        fetchUserRole();
        getRealty();
        getLinen();
    }, []);

    //to get realty datails
    const getRealty = async () => {
        const querySnapshot = await getDocs(collection(dataFire, "realty"))
        const villaAp = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setVillaAp(villaAp)
    }
    //to get linen datails
    const getLinen = async () => {
        const querySnapshot = await getDocs(collection(dataFire, "linen"))
        const villaLinen = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setVillaLinen(villaLinen)
        console.log(villaLinen)
    }

    //function for more details about villas
    const getSelectVilla = (villaApId: string) => {
        const villaD = villaAp.find(t => t.id === villaApId)
        if (villaD ) {
            setSelectVillaAp(villaD)
            setEditForm(villaD)
        }
    }

    const getSelectLinen = (villaApId: any) => {
        console.log(villaApId)
        const linens = villaLinen.find(linen => linen.id === villaApId)
        if (linens){
            setSelectVillaLinen(linens) 
            setEditLinenForm(linens)
            console.log(linens)
        }     
    }
    //to Delete the selected apartment
    const deleteAp = async (id: any) => {

        deleteDoc(doc(dataFire,"realty",id))
        //Call agent getRealty to display the change
        getRealty()
    }



    useEffect(() =>{
        getRealty()
        getLinen()
    },[])

    // Handles input changes for the edit form fields
    const handleInputChange = (e: CustomEvent) => {
        const target = e.target as HTMLInputElement
        // Destructure the name and value from the target
        const { name, value } = target
        // Update the edit form state with the new value
        setEditForm({
            ...editForm,
            [name]: value
        })
    }

    const handleLinenInputChange = (e: CustomEvent) => {
        const target = e.target as HTMLInputElement
        const { name, value } = target
        setEditLinenForm({
            ...editLinenForm,
            [name]: value
        })
    }

    // Handles saving the edited villa details
    const handleSave = async () => {
        try {
            // Ensure the edit form has a valid villa ID
            if (!editForm.id) {
                throw new Error('Invalid villa ID')
            }
            // Get a reference to the Firestore document for the villa
            const villaDoc = doc(dataFire, 'realty', editForm.id)
            await updateDoc(villaDoc, editForm)
            getRealty() // Refresh the list
        } catch (error) {
            console.error('Error updating villa data:', error)
        }
    }

    const handleLinenSave = async () => {
        try {
            if (!editLinenForm.id) {
                throw new Error("Invalid linen ID")
            }
            const linenDoc = doc(dataFire, "linen", editLinenForm.id)
            await updateDoc(linenDoc, editLinenForm)
            
            getLinen() // Refresh the list
        } catch (error) {
            console.error("Error updating linen data:", error)
        }
    }
    useEffect(() => {
        // If page was navigated with the reload flag, refresh data
        if (location.state) {
          getRealty();
          getLinen();
        }
      }, [location]);

    return (
        <IonPage  >
            <IonHeader >
                <IonToolbar color="secondary">
                    <IonButtons slot='start'>
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Villas & Apartments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'} className='ion-padding' >
                <IonTitle id='title'>
                    Houses Names
                </IonTitle>
                <IonGrid>
                    <IonCol>
                {villaAp.map((item, index) =>(
                    <IonCard id='aprt-card' key={index} button onClick={() =>getSelectVilla(item.id)}  >
                        <IonItem color={"dark"}>
                            {item.id} 
                            <IonButtons slot='end'>
                                <IonButton id="modal-details" onClick={() => setModal(true)} >
                                    <IonIcon color='primary' icon={informationCircleOutline} ></IonIcon>
                                </IonButton>
                                <IonButton id="modal-linen" onClick={() => {setModalLinen(true),getSelectLinen(item.id)} }>
                                    <IonIcon   icon={bedOutline} ></IonIcon>
                                </IonButton>
                                <IonButton disabled={role !== 'Admin'} onClick={() => {setVillaToDelete(item.id); setShowDeleteAlert(true); }}>
                                    <IonIcon color='danger'  icon={trashOutline} ></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonItem>
                    </IonCard>
                 ))}
                 </IonCol>
                 </IonGrid>

                 
                 {/* Delete confirmation alert */}
                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header={'Delete Confirmation'}
                    message={'Are you sure you want to delete this villa?'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                setVillaToDelete(null); // Reset villaToDelete on cancel
                            }
                        },
                        {
                            text: 'Delete',
                            handler: async () => {
                                if (villaToDelete) {
                                    await deleteAp(villaToDelete); // Call delete function
                                    setVillaToDelete(null); // Reset after deletion
                                }
                            }
                        }
                    ]}
                />
                 
                 <IonModal isOpen={showmodal} onDidDismiss={() => setModal(false)} ref={modal}  id="modal-details" >
                    <IonHeader >
                        <IonToolbar color={"secondary"}>
                            <IonTitle>Accommodation information</IonTitle>
                            <IonButtons slot='end' onClick={()=> setModal(false)}>
                                <IonButton>
                                    <IonIcon size='large'  slot='icon-only' icon={closeCircleOutline}  />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>   
                    </IonHeader>
                    <IonContent  color={'light'}>
                        <IonCard id='modal-center' color={"dark"}>
                            <IonItem  color={"dark"}>
                                <IonLabel position="stacked">Location</IonLabel>
                                    <IonInput
                                        value={editForm.Location || ''}
                                        onIonChange={handleInputChange}
                                        name="Location"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">S.M. Interior Space</IonLabel>
                                    <IonInput
                                        value={editForm.IndoorSpase || ''}
                                        onIonChange={handleInputChange}
                                        name="IndoorSpase"
                                    />                                
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">S.M. Outdoor Space</IonLabel>
                                    <IonInput
                                        value={editForm.OutdoorSpase || ''}
                                        onIonChange={handleInputChange}
                                        name="OutdoorSpase"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">House Floors</IonLabel>
                                <IonInput
                                    value={editForm.Levels || ''}
                                    onIonChange={handleInputChange}
                                    name="Levels"
                                />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Bedrooms</IonLabel>
                                    <IonInput
                                        value={editForm.Rooms || ''}
                                        onIonChange={handleInputChange}
                                        name="Rooms"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Bathrooms</IonLabel>
                                    <IonInput
                                        value={editForm.Bathroom || ''}
                                        onIonChange={handleInputChange}
                                        name="Bathroom"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Kitchen</IonLabel>
                                    <IonInput
                                        value={editForm.Kitchen || ''}
                                        onIonChange={handleInputChange}
                                        name="Kitchen"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Barbecue</IonLabel>
                                    <IonInput
                                        value={editForm.Barbecue || ''}
                                        onIonChange={handleInputChange}
                                        name="Barbecue"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Sauna</IonLabel>
                                    <IonInput
                                        value={editForm.Sauna || ''}
                                        onIonChange={handleInputChange}
                                        name="Sauna"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Wc</IonLabel>
                                    <IonInput
                                        value={editForm.Wc || ''}
                                        onIonChange={handleInputChange}
                                        name="Wc"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Single Beds</IonLabel>
                                    <IonInput
                                        value={editForm.SingleBed || ''}
                                        onIonChange={handleInputChange}
                                        name="SingleBed"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Double Beds</IonLabel>
                                    <IonInput
                                        value={editForm.DoubleBed || ''}
                                        onIonChange={handleInputChange}
                                        name="DoubleBed"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Checkin Day</IonLabel>
                                    <IonInput
                                        value={editForm.ChekinDay || ''}
                                        onIonChange={handleInputChange}
                                        name="ChekinDay"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Booking from Tourist Office</IonLabel>
                                    <IonInput
                                        value={editForm.Office || ''}
                                        onIonChange={handleInputChange}
                                        name="Office"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Tourist Office Name</IonLabel>
                                    <IonInput
                                        value={editForm.OfficeName || ''}
                                        onIonChange={handleInputChange}
                                        name="OfficeName"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Watering Plants</IonLabel>
                                    <IonInput
                                        value={editForm.Planting || ''}
                                        onIonChange={handleInputChange}
                                        name="Planting"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Yard Furniture Cleaning</IonLabel>
                                    <IonInput
                                        value={editForm.FurnitureOut || ''}
                                        onIonChange={handleInputChange}
                                        name="FurnitureOut"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Outdoor Sweeping</IonLabel>
                                    <IonInput
                                        value={editForm.BroomOut || ''}
                                        onIonChange={handleInputChange}
                                        name="BroomOut"
                                    />
                            </IonItem>
                        </IonCard>
                        <IonFab horizontal='end' vertical='bottom'  >
                            <IonFabButton onClick={handleSave} color="secondary">
                                <IonIcon icon={saveOutline}></IonIcon>
                            </IonFabButton>
                        </IonFab>
                    </IonContent>
                 </IonModal>
                 
                 <IonModal  isOpen={showmodalLinen} onDidDismiss={() => setModalLinen(false)} ref={modal} id="modal-linen" >
                
                    <IonHeader >
                        <IonToolbar color={"secondary"}>
                            <IonTitle>Linen information </IonTitle>
                            <IonButtons slot='end' onClick={()=> setModalLinen(false)}>
                                <IonButton>
                                    <IonIcon size='large'  slot='icon-only' icon={closeCircleOutline}  />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>   
                    </IonHeader>
                    <IonContent >
                        <IonCard  color={"dark"}>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Name of the house</IonLabel>
                                    <IonInput
                                        value={editLinenForm.id || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="id"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Laundry Name</IonLabel>
                                    <IonInput
                                        value={editLinenForm.LaundryName || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="LaundryName"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Double Bed Sheets</IonLabel>
                                    <IonInput
                                        value={editLinenForm.DoubleBedSheets || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="DoubleBedSheets"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Single Bed Sheets</IonLabel>
                                    <IonInput
                                        value={editLinenForm.SingleBedSheets || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="SingleBedSheets"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Pillow Cases</IonLabel>
                                    <IonInput
                                        value={editLinenForm.PillowCases || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="PillowCases"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Big Towels</IonLabel>
                                    <IonInput
                                        value={editLinenForm.BigTowels || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="BigTowels"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Small Towels</IonLabel>
                                    <IonInput
                                        value={editLinenForm.SmallTowels || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="SmallTowels"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Coverlets</IonLabel>
                                    <IonInput
                                        value={editLinenForm.Coverlets || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="Coverlets"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Fitted Sheets</IonLabel>
                                    <IonInput
                                        value={editLinenForm.FittedSheets || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="FittedSheets"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Quilted Pillow Casee</IonLabel>
                                    <IonInput
                                        value={editLinenForm.QuiltedPillowCasee || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="QuiltedPillowCasee"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Hand Towels</IonLabel>
                                    <IonInput
                                        value={editLinenForm.HandTowels || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="HandTowels"
                                    />
                            </IonItem>
                            <IonItem color={"dark"}>
                                <IonLabel position="stacked">Robe</IonLabel>
                                    <IonInput
                                        value={editLinenForm.Robe || ''}
                                        onIonChange={handleLinenInputChange}
                                        name="Robe"
                                    />
                            </IonItem>
                        </IonCard>
                        <IonFab horizontal='end' vertical='bottom' slot="fixed" >
                            <IonFabButton onClick={handleLinenSave} color="secondary">
                                <IonIcon icon={saveOutline}></IonIcon>
                            </IonFabButton>
                        </IonFab>
                    </IonContent>
                 </IonModal>
                 {role === "Admin" && (
                    <IonFab horizontal='end' vertical='bottom'  >
                        <IonFabButton routerLink="/app/villas/add" color="secondary">
                            <IonIcon icon={addCircleOutline}></IonIcon>
                        </IonFabButton>
                    </IonFab>
                )}
            </IonContent>
        </IonPage>
    )
}

export default VillasAp 