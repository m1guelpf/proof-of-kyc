import { FC } from 'react'
import '@/styles/tailwind.css'
import { AppProps } from 'next/app'

const App: FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />

export default App
