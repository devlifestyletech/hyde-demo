import { collection, query, where } from 'firebase/firestore'
import { db } from '../../../../utils/firebaseConfig'

const facilitiesCollection = query(collection(db, 'facilities'))
const reservationsCollection = query(
  collection(db, 'reservations'),
  where('facility_id', '==', selectedFacilities),
)

export { facilitiesCollection, reservationsCollection }
