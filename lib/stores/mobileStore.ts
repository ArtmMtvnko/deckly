import { create } from 'zustand'

interface MobileState {
  isMobile: boolean
  setMobile: (mobile: boolean) => void
}

export const useMobileStore = create<MobileState>((set) => ({
  isMobile: false,
  setMobile: (mobile) => set({ isMobile: mobile }),
}))
