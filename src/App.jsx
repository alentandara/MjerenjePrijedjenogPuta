import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'

import TipPregled from './pages/tipovi/TipPregled'
import TipNovi from './pages/tipovi/TipNovi'
import TipPromjena from './pages/tipovi/TipPromjena'

import PutPregled from './pages/putevi/PutPregled'
import PutNovi from './pages/putevi/PutNovi'
import PutPromjena from './pages/putevi/PutPromjena'
import PutKarta from './pages/putevi/PutKarta'

// 👇 NOVO – import stranice za generiranje
import PutGeneriranje from './pages/putevi/PutGeneriranje'

import OznakaPregled from './pages/oznake/OznakaPregled'
import OznakaNovi from './pages/oznake/OznakaNovi'
import OznakaPromjena from './pages/oznake/OznakaPromjena'

function App() {
  return (
    <Container>
      <Izbornik />

      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />

        <Route path={RouteNames.TIPOVI} element={<TipPregled />} />
        <Route path={RouteNames.TIPOVI_NOVI} element={<TipNovi />} />
        <Route path={RouteNames.TIPOVI_PROMJENA} element={<TipPromjena />} />

        <Route path={RouteNames.PUTEVI} element={<PutPregled />} />
        <Route path={RouteNames.PUTEVI_NOVI} element={<PutNovi />} />
        <Route path={RouteNames.PUTEVI_PROMJENA} element={<PutPromjena />} />
        <Route path={RouteNames.PUTEVI_KARTA} element={<PutKarta />} />

        {/* 👇 NOVA RUTA */}
        <Route path={RouteNames.PUTEVI_GENERIRAJ} element={<PutGeneriranje />} />

        <Route path={RouteNames.OZNAKE} element={<OznakaPregled />} />
        <Route path={RouteNames.OZNAKE_NOVI} element={<OznakaNovi />} />
        <Route path={RouteNames.OZNAKE_PROMJENA} element={<OznakaPromjena />} />
      </Routes>

      <hr />
      &copy; 2026
    </Container>
  )
}

export default App