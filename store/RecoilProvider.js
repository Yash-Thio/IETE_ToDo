"use client"
import { RecoilRoot } from 'recoil';
import { ReactNode } from 'react';

export default function RecoilProvider({ children }) {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
}