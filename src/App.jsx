

import'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import TipPregled from './pages/tipovi/TipPregled'
import TipNovi from './pages/tipovi/TipNovi'
import TipPromjena from './pages/tipovi/TipPromjena'
import IzracunPuta from './pages/IzracunPuta'

function App() {
 
  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.TIPOVI} element={<TipPregled />} />
        <Route path={RouteNames.TIPOVI_NOVI} element={<TipNovi />} />
        <Route path={RouteNames.TIPOVI_PROMJENA} element={<TipPromjena />} />

        <Route path={RouteNames.IZRACUN_PUTA} element={<IzracunPuta />} />
      </Routes>
      <hr />
      &copy; 2026
    </Container>
  )
}

export default App
