
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function FixedThemeProvider({ children, ...props }: ThemeProviderProps) {
  console.log('FixedThemeProvider - Rendered');
  
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
