import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import './App.css'
// import { DialogsList } from './features/dialogs/DialogsList'
import Main from './Views/Main' // Dima branch
import { ChatModulesProvider } from './Contexts/ChatModulesContext'

export default function App() {
  return (
    <RecoilRoot>
      <ChatModulesProvider>
        <Router>
          <Routes>
            {/* CHANGE TO DialogsList here if you want to test. */}
            <Route path="/" element={<Main />} />
          </Routes>
        </Router>
      </ChatModulesProvider>
    </RecoilRoot>
  )
}
