const Authentication = {
  authState: false,
  jwt: null,
  user: null,
}

const AuthReducer = (state = Authentication, action) => {
  switch (action.type) {
    case 'CHANGE_AUTH_STATE':
      return {
        ...state,
        authState: action.payload.authState,
        jwt: action.payload.jwt,
        user: action.payload.user,
      }
    default:
      return state
  }
}

export { AuthReducer }
