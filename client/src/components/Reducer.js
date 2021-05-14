const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "ADD_ROOM":
      const id = action.payload.id;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [id]: action.payload.room,
        },
      };

    default:
      return state;
  }
};
export default Reducer;
