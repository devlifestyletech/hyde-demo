const FacilityReservation = {
  reserves: null,
  facilities: null,
}

const FacilityManagementReducer = (state = FacilityReservation, action) => {
  switch (action.type) {
    case 'UPDATE_FACILITIES':
      return { ...state, facilities: action.payload }
    default:
      return state
  }
}

export { FacilityManagementReducer }
