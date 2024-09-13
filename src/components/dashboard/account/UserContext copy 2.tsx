import React, { createContext, useContext, useState, ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  profilePictureUrl: string;
  phone_number: string;
  gender: string;
  birthday: Dayjs;
  users_id: string;
  user_image: string;
}

interface Store {
  store_id: string;
  name_store: string;
  phone_number: string;
  house_number: string;
  alley: string;
  road: string;
  district: string;
  sub_district: string;
  province: string;
  store_image: string;
  users_id: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    role: '',
    profilePictureUrl: '',
    phone_number: '',
    gender: '',
    birthday: dayjs(),
    users_id: '',
    user_image: '',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Store Context
interface StoreContextType {
  store: Store; // เปลี่ยนให้ store เป็น Store ไม่รองรับ null
  setStore: React.Dispatch<React.SetStateAction<Store>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store>({
    store_id: '',
    name_store: '',
    phone_number: '',
    house_number: '',
    alley: '',
    road: '',
    district: '',
    sub_district: '',
    province: '',
    store_image: '',
    users_id: '',
    createdAt: '',
    updatedAt: '',
  });

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
