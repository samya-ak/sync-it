const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SHOW_SNACKBAR":
      return {
        ...state,
        snackbar: {
          open: action.payload.open,
          severity: action.payload.severity,
          message: action.payload.message,
        },
      };

    case "ADD_ROOM":
      return {
        ...state,
        room: action.payload,
      };

    case "ADD_SELF":
      return {
        ...state,
        self: action.payload,
      };

    case "ADD_USERNAME":
      return {
        ...state,
        username: action.payload,
      };

    case "UPDATE_MESSAGES":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "REFRESH":
      console.log("refresh occured>>>");
      return {
        ...state,
        refresh: state.refresh + action.payload,
      };

    case "RESET":
      console.log("reset>>>>", state);
      return {
        error: null,
        room: null,
        self: null,
        username: "Anonymous",
        messages: [],
        refresh: 0,
        snackbar: {
          open: false,
          severity: null,
          message: null,
        },
      };

    default:
      return state;
  }
};
export default Reducer;
