

import'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import TipPregled from './pages/tipovi/TipPregled'
import TipNovi from './pages/tipovi/TipNovi'

function App() {
 
  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.TIPOVI} element={<TipPregled />} />
        <Route path={RouteNames.TIPOVI_NOVI} element={<TipNovi />} />
      </Routes>
      <hr />
      &copy; XXXXX
    </Container>
  )
}

export default App
