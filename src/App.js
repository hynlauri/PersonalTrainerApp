import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerList from './CustomerList'; // Asiakaslistakomponentti
import TrainingList from './TrainingList'; // Harjoitusten listakomponentti
import TrainingCalendar from './TrainingCalendar'; // Kalenterikomponentti

const App = () => {
  return (
    <Router>
      <div>
        <h1>Personal Trainer App</h1>

        {/* Navigointivalikko */}
        <nav>
          <ul>
            <li>
              <Link to="/customers">Asiakkaat</Link>
            </li>
            <li>
              <Link to="/trainings">Harjoitukset</Link>
            </li>
            <li>
              <Link to="/calendar">Kalenteri</Link>
            </li>
          </ul>
        </nav>

        {/* Reitit */}
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/calendar" element={<TrainingCalendar />} /> {/* Kalenteri-reitti */}
          <Route path="/" element={
            <div>
              <h2>Tervetuloa Personal Trainer Appiin!</h2>
              <p>Valitse toiminto: Asiakkaat, Harjoitukset tai Kalenteri.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
