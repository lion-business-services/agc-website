import { createContext, useCallback, useContext, useState } from "react";
import EstimateDialog from "./EstimateDialog";

const Ctx = createContext({ openEstimate: () => {} });
export const useEstimate = () => useContext(Ctx);

/** Any button on the site can call openEstimate("Deck") to open the form pre-filled. */
export function EstimateProvider({ children }) {
  const [state, setState] = useState({ open: false, type: "", key: 0 });
  const openEstimate = useCallback((type = "") => setState((s) => ({ open: true, type, key: type ? s.key + 1 : s.key })), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  return (
    <Ctx.Provider value={{ openEstimate }}>
      {children}
      <EstimateDialog open={state.open} onClose={close} initialType={state.type} formKey={state.key} />
    </Ctx.Provider>
  );
}
