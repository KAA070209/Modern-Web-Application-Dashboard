import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ProfileContext = createContext(null)
const STORAGE_KEY = 'nexora-profile'

export const DEFAULT_PROFILE = {
  name: 'Andi Pratama',
  email: 'andi.pratama@nexora.io',
  company: 'Nexora Inc.',
  role: 'Administrator',
  photo: null,
}

function loadProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(loadProfile)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const setProfile = useCallback((updater) => {
    setProfileState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const resetProfile = useCallback(() => {
    setProfileState(DEFAULT_PROFILE)
  }, [])

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      resetProfile,
      initials: (profile.name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    }),
    [profile, setProfile, resetProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}
