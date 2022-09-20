const AuthState = {
  isAuthenticated: false,
  userData: null,
  token: null,
}

const AuthReducer = (state = AuthState, action) => {
  switch (action.type) {
    case 'UPDATE_AUTH_STATE':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userData: action.payload.userData,
        token: action.payload.token,
      }
    default:
      return state
  }
}
export { AuthReducer }
