import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import './App.css'
import { DialogsList } from './features/dialogs/DialogsList'
import Main from './Views/Main' // Dima branch

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </RecoilRoot>
  )
}
