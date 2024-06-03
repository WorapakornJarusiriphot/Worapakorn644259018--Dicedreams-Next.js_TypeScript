import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
  profilePictureUrl: string;
  phoneNumber: string;
  gender: string;
  birthday: Dayjs;
  users_id: string;
  userImage: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    userType: '',
    profilePictureUrl: '',
    phoneNumber: '',
    gender: '',
    birthday: dayjs(),
    users_id: '',
    userImage: '',
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
