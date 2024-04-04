import logo from './logo.svg';
import './App.css';
import NavBar from './component/NavBar';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import DonateListPage from './pages/DonateListPage';
import FundRaisePage from './pages/FundraisePage';
import DonateHistoryPage from './pages/DonateHistoryPage';
import FundraisingProjectPage from './pages/FundraisingProjectPage';
import DonatePage from './pages/DonatePage';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';


function getLibrary(provider) {
  return new Web3Provider(provider)
}

function App() {


  return (
    <div className="App">
    <Web3ReactProvider getLibrary={getLibrary}>
    <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/home" exact element={<HomePage />} />
          <Route path="/donate/:id" element={<DonatePage />} />
          <Route path="/donate" element={<DonateListPage />} />
          <Route path="/fundraise" element={<FundRaisePage />} />
          <Route path="/donatehistory" element={<DonateHistoryPage />} />
          <Route path="/fundraisingproject" element={<FundraisingProjectPage />} />
        </Routes>
    </BrowserRouter>
    </Web3ReactProvider>
    </div>
  );
}

export default App;
