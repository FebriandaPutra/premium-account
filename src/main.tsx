import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, ColorModeScript, extendTheme, ThemeConfig  } from '@chakra-ui/react'
import './index.css'

const theme: ThemeConfig = extendTheme({
  fonts: {
    body: `'Poppins', sans-serif`,
  },
  initialColorMode: 'dark',
  useSystemColorMode: false,
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.initialColorMode} />
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </Router>
)

export default theme