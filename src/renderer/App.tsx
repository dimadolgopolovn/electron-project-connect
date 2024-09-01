import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './App.css';
import { DialogsList } from './features/dialogs/DialogsList';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<DialogsList />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
