import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './ui/App'
import { DependenciesProvider } from './infrastructure/context/DependenciesContext'
import './ui/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DependenciesProvider>
            <App />
        </DependenciesProvider>
    </React.StrictMode>,
)
