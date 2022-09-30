const FacilityReservation = {
  reserves: null,
  facilities: null,
}

const FacilitiesManagementReducer = (state = FacilityReservation, action) => {
  switch (action.type) {
    case 'UPDATE_FACILITIES':
      return { ...state, facilities: action.payload }
    case 'UPDATE_RESERVES':
      return { ...state, reserves: action.payload }
    default:
      return state
  }
}

export { FacilitiesManagementReducer }
