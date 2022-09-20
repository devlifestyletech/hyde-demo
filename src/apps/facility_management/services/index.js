import { collection, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebaseConfig'

const getAllFacilitiesData = () =>
  async (dispatch) => {
    const queryAllFacilities = query(collection(db, 'facilities'))
    await onSnapshot(queryAllFacilities, QuerySnapshot => {
      let facilities = []
      QuerySnapshot.forEach((doc) => {
        let data = { id: doc.id, ...doc.data() }
        facilities.push(data)
      })
      dispatch({ type: 'UPDATE_FACILITIES', payload: facilities })
    })
  }

const getAllReserves = () => async (dispatch) => {
  const queryAllReserves = query(
    collection(db, 'reserves'),
  )

  await onSnapshot(queryAllReserves, (QuerySnapshot) => {
    let reserves = []
    QuerySnapshot.forEach((doc) => {
      let data = { id: doc.id, ...doc.data() }
      reserves.push(data)
    })
    dispatch({ type: 'UPDATE_RESERVES', payload: reserves })
  })
}

const updateFacility = async (docRef, value) => {
  try {
    await updateDoc(docRef, value)
    await getAllFacilitiesData()
    return { success: true, errorMsg: null }
  } catch (e) {
    return { success: false, errorMsg: e }
  }
}

export { getAllFacilitiesData, getAllReserves, updateFacility }
