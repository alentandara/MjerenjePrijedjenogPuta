

import'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { RouteNames } from './constants'
import SmjerPregled from './pages/smjerovi/SmjerPregled'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

function App() {
 
  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SMJEROVI} element={<SmjerPregled />} />
      </Routes>
      <hr />
      &copy; Edunova
    </Container>
  )
}

export default App
