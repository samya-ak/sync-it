import { createContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
  error: null,
  room: null,
  self: null,
  username: "Anonymous",
  messages: [],
  refresh: 0,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
