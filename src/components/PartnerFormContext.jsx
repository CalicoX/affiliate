import { createContext, useCallback, useContext, useMemo, useState } from "react";
import PartnerFormModal from "./PartnerFormModal.jsx";

const PartnerFormContext = createContext(null);

export function PartnerFormProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openForm = useCallback(() => setOpen(true), []);
  const closeForm = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openForm, closeForm }), [openForm, closeForm]);

  return (
    <PartnerFormContext.Provider value={value}>
      {children}
      <PartnerFormModal open={open} onClose={closeForm} />
    </PartnerFormContext.Provider>
  );
}

export function usePartnerForm() {
  const ctx = useContext(PartnerFormContext);
  if (!ctx) throw new Error("usePartnerForm must be used within PartnerFormProvider");
  return ctx;
}
