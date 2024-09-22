import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButtons, IonMenuButton, IonCard, IonItem, IonLabel, IonCheckbox, IonList } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'; // Added updateDoc and doc for updating Firestore
import { dataFire } from './FirebaseConfig';
import { useAuth } from '../components/AuthContext';

interface Job {
  id: string;
  location: string;
  problemDescription: string;
  selectedMaintainer: string;
  createdAt: any;
  done: boolean; 
}

const MyJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { role, user } = useAuth(); // Get the current user and role from AuthContext

  // Fetch jobs from Firestore where selectedMaintainer is the current user
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || role !== 'Maintenance') return; // Only fetch jobs for logged-in maintenance users

      try {
        const q = query(collection(dataFire, 'maintenanceReports'), where('selectedMaintainer', '==', user?.uid), where('done', '==', false)); // Only fetch jobs that are not done
        const querySnapshot = await getDocs(q);
        const jobsList: Job[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        setJobs(jobsList);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [user, role]);

  // Handle checkbox toggle for marking a job as done
  const handleJobDone = async (jobId: string, done: boolean) => {
    try {
      // Update Firestore
      const jobDocRef = doc(dataFire, 'maintenanceReports', jobId);
      await updateDoc(jobDocRef, { done: done });

      // Update local state to remove the job
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Jobs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'} className="ion-padding">
        {jobs.length === 0 ? (
          <IonText color={'danger'}>No tasks assigned to you yet.</IonText>
        ) : (
          <IonCard color="dark">
            {jobs.map((job) => (
              <IonCard key={job.id} color="dark">
                <IonItem color="dark">
                  <IonLabel>
                    <h2>Location: {job.location}</h2>
                    <p>Description: {job.problemDescription}</p>
                  </IonLabel>
                  <IonCheckbox
                    slot="end"
                    checked={job.done}
                    onIonChange={(e: { detail: { checked: boolean; }; }) => handleJobDone(job.id, e.detail.checked!)} // Update Firestore and remove the job when marked as done
                  />
                </IonItem>
              </IonCard>
            ))}
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyJob;
