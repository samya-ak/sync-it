import { createContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
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

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
