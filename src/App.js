import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import CustomerList from './CustomerList';
import TrainingList from './TrainingList';
import TrainingCalendar from './TrainingCalendar';
import StatisticsPage from './StatisticsPage';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    // Haetaan asiakastiedot API:sta
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/getcustomers');
        setCustomers(response.data); // Oletetaan, että data on asiakaslista
      } catch (error) {
        console.error('Asiakkaiden haku epäonnistui:', error);
      }
    };

    // Haetaan harjoitustiedot API:sta
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings');
        setTrainings(response.data); // Oletetaan, että data on harjoituslista
      } catch (error) {
        console.error('Harjoitusten haku epäonnistui:', error);
      }
    };

    fetchCustomers();
    fetchTrainings();
  }, []); // Tämä effecti ajetaan vain komponentin ensimmäisellä renderöinnillä

  return (
    <Router>
      <div>
        <h1>Personal Trainer App</h1>

        {/* Navigointivalikko */}
        <nav>
          <ul>
            <li><Link to="/customers">Asiakkaat</Link></li>
            <li><Link to="/trainings">Harjoitukset</Link></li>
            <li><Link to="/calendar">Kalenteri</Link></li>
            <li><Link to="/statistics">Tilastot</Link></li> {/* Uusi linkki tilastosivulle */}
          </ul>
        </nav>

        {/* Reitit */}
        <Routes>
          <Route path="/customers" element={<CustomerList customers={customers} />} />
          <Route path="/trainings" element={<TrainingList trainings={trainings} />} />
          <Route path="/calendar" element={<TrainingCalendar />} />
          <Route path="/statistics" element={<StatisticsPage trainings={trainings} customers={customers} />} /> {/* Lisää reitti tilastosivulle */}
          <Route path="/" element={<div><h2>Tervetuloa Personal Trainer Appiin!</h2></div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
