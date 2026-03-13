import { create } from "zustand";

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, addr: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

const demoAddresses: SavedAddress[] = [
  { id: "1", label: "Home", street: "Keizersgracht 123", city: "Amsterdam", postcode: "1015 CJ", isDefault: true },
  { id: "2", label: "Office", street: "Herengracht 456", city: "Amsterdam", postcode: "1017 CA", isDefault: false },
];

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: demoAddresses,
  addAddress: (addr) =>
    set((state) => ({
      addresses: [
        ...state.addresses.map((a) => (addr.isDefault ? { ...a, isDefault: false } : a)),
        { ...addr, id: Date.now().toString() },
      ],
    })),
  updateAddress: (id, updates) =>
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  removeAddress: (id) =>
    set((state) => {
      const updated = state.addresses.filter((a) => a.id !== id);
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0].isDefault = true;
      }
      return { addresses: updated };
    }),
  setDefault: (id) =>
    set((state) => ({
      addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    })),
}));
