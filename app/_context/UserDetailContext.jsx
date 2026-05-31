"use client";

import { createContext } from "react";

export const UserDetailContext = createContext({
  userDetail: {
    credits: 5,
  },
  setUserDetail: () => {},
});