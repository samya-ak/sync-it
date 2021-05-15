const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "ADD_ROOM":
      return {
        ...state,
        room: action.payload,
      };

    default:
      return state;
  }
};
export default Reducer;
