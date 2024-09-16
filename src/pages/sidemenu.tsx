import { IonButton, IonCard, IonContent, IonHeader, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, IonIcon, IonLabel } from '@ionic/react';
import React from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import { useAuth } from '../components/AuthContext'; 
import home from './HomePage';
import Villas from './VillasAp';
import AddHome from './AddHome';
import AddLinen from './AddLinen';
import ToDo from './ToDo';
import LostFound from './LostandFound';
import Notes from './Notes';
import { getAuth, signOut } from '@firebase/auth';
import Profile from './Profile';
import Status from './Status';
import { barChartOutline, calendarOutline, colorWandOutline, constructOutline, flashlightOutline, folderOpenOutline, hammerOutline, homeOutline, personCircleOutline, receiptOutline } from 'ionicons/icons'; 
import Maintenance from './Maintenance';
import UsersList from './UsersList';
import Register from './Register';
import MyJob from './MyJob';

const Page2cp: React.FC = () => {
    const history = useHistory();
    const auth = getAuth();
    const { logout, role } = useAuth();  // Get the role from AuthContext

    // Define available paths based on role
    const paths = [
        ...(role === 'Admin' || role === 'Housekeeper' ? [{ name: 'Home', url: '/app/home', icon: calendarOutline }] : []),
        ...(role === 'Maintenance' ? [{ name: 'My Job', url: '/app/my-job', icon: hammerOutline }] : []),
        ...(role === 'Admin' ? [{ name: 'Realty Status', url: '/app/status', icon: barChartOutline }] : []), 
        ...(role === 'Admin' || role === 'Housekeeper' ? [{ name: 'To Do', url: '/app/todo', icon: receiptOutline }] : []),
        ...(role === 'Admin' || role === 'Housekeeper' ? [{ name: 'Villas', url: '/app/villas', icon: homeOutline }] : []),
        ...(role === 'Admin' || role === 'Housekeeper' ? [{ name: 'Lost and Found', url: '/app/lost-found', icon: flashlightOutline }] : []),
        { name: 'Notes', url: '/app/notes', icon: colorWandOutline },
        ...(role === 'Admin' ? [{ name: 'Maintenance', url: '/app/maintenance', icon: constructOutline }] : []),
        ...(role === 'Admin' ? [{ name: 'Users List', url: '/app/list-of-users', icon: folderOpenOutline }] : []),
        ...(role === 'Admin' || role === 'Housekeeper' ? [{ name: 'My Account', url: '/app/profile', icon: personCircleOutline }] : []),
    ].filter(item => item);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user using Firebase Auth
            logout();
            history.push('/'); // Redirect to the login page after successful logout
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <IonPage>
            <IonSplitPane contentId="main">
                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar color="secondary">
                            <IonTitle>House Hero</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent color="dark">
                        {paths.map((item, index) => (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem color="dark" routerLink={item!.url} routerDirection="root">
                                    <IonIcon slot="start" icon={item.icon} />  
                                    <IonLabel>{item.name}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <IonMenuToggle autoHide={false}>
                            <IonButton fill="clear" expand="full" onClick={handleLogout} routerDirection="root">
                                Logout
                            </IonButton>
                        </IonMenuToggle>
                    </IonContent>
                </IonMenu>

                <IonRouterOutlet id="main">
                    {/* Protected routes based on roles */}
                    {role === 'Admin' || role === 'Housekeeper' ? <Route exact path="/app/home" component={home} /> : <Redirect to="/app/my-job" />}
                    {role === 'Admin' || role === 'Housekeeper' ? <Route exact path="/app/todo" component={ToDo} /> : <Redirect to="/app/my-job" />}
                    {role === 'Admin' || role === 'Housekeeper' ? <Route exact path="/app/villas" component={Villas} /> : <Redirect to="/app/my-job" />}
                    <Route exact path="/app/villas/add" component={AddHome} />
                    {role === 'Admin' || role === 'Housekeeper' ? <Route path="/app/lost-found" component={LostFound} /> : <Redirect to="/app/my-job" />}
                    <Route path="/app/notes" component={Notes} />
                    {role === 'Admin' || role === 'Housekeeper' ? <Route path='/app/profile' component={Profile} />: <Redirect to="/app/profile"/>}
                    {role === 'Admin' ? <Route path="/app/status" component={Status} /> : <Redirect to="/app/my-job" />}
                    {role === 'Admin' ? <Route path="/app/maintenance" component={Maintenance} /> : <Redirect to="/app/my-job" />}
                    {role === 'Admin' ? <Route path="/app/list-of-users" component={UsersList} /> : <Redirect to="/app/my-job" />}
                    <Route path="/app/users/add" component={Register} />
                    {role === 'Maintenance' ? <Route exact path="/app/my-job" component={MyJob} /> : <Redirect to="/app/home" />}
                    <Route exact path="/app/villas/add/linen/:id" component={AddLinen} />
                    <Route exact path="/app">
                        <Redirect to={role === 'Maintenance' ? "/app/my-job" : "/app/home"} />
                    </Route>
                </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};

export default Page2cp;
