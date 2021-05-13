import { useContext, useEffect } from "react";
import { Context } from "./Store";
const Error = () => {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_ERROR", payload: null });
    }, 3000);
  });

  return <p style={{ color: "red" }}>Something went wrong: {state.error}</p>;
};

export default Error;
