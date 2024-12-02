import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Lomakkeen tiedot
  const [newTraining, setNewTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customerId: '', // Asiakas ID
  });

  // Tiedot muokattavasta harjoituksesta
  const [editTraining, setEditTraining] = useState(null); // Uusi tila

  useEffect(() => {
    // Ladataan harjoitukset
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
      .then((response) => {
        setTrainings(response.data);
        console.log('Harjoitustiedot ladattu:', response.data); 
      })
      .catch((error) => {
        console.error('Harjoitusten haku epäonnistui:', error);
      });

    // Ladataan asiakkaat
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/getcustomers')
      .then((response) => {
        setCustomers(response.data);
        console.log('Asiakastiedot ladattu:', response.data);
      })
      .catch((error) => {
        console.error('Asiakastiedon haku epäonnistui:', error);
      });
  }, []);

  // Asiakkaan nimen hakeminen harjoitustiedosta
  const getCustomerName = (customerId) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? `${customer.firstname} ${customer.lastname}` : 'Ei asiakasta';
  };

  // Harjoituksen muokkaaminen
  const handleEditTraining = (training) => {
    setEditTraining(training);
    setNewTraining({
      date: training.date,
      duration: training.duration,
      activity: training.activity,
      customerId: training.customer ? training.customer.id : '',
    });
  };

  // Harjoituksen päivittäminen back-endiin
  const handleUpdateTraining = () => {
    axios
      .put(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${editTraining.id}`, newTraining)
      .then((response) => {
        // Päivitetään harjoitus listassa
        setTrainings(trainings.map((training) => 
          training.id === editTraining.id ? response.data : training
        ));
        setEditTraining(null); // Tyhjennetään muokkaustila
        setNewTraining({ date: '', duration: '', activity: '', customerId: '' });
        console.log('Harjoitus päivitetty:', response.data);
      })
      .catch((error) => {
        console.error('Harjoituksen päivitys epäonnistui:', error);
      });
  };

  // Lajittelufunktio
  const handleSort = (field) => {
    const sorted = [...trainings].sort((a, b) => {
      if (field === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (field === 'activity') {
        return sortOrder === 'asc'
          ? a.activity.localeCompare(b.activity)
          : b.activity.localeCompare(a.activity);
      }
      return 0;
    });

    setTrainings(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
  };

  // Harjoituksen poistaminen
  const handleDeleteTraining = (id) => {
    axios
      .delete(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${id}`)
      .then(() => {
        setTrainings(trainings.filter((training) => training.id !== id));
        console.log('Harjoitus poistettu:', id);
      })
      .catch((error) => {
        console.error('Harjoituksen poisto epäonnistui:', error);
      });
  };

  return (
    <div>
      <h1>Harjoitustiedot</h1>
      <div>
        <div>
          <label>Järjestä:</label>
          <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
            <option value="date">Päivämäärä</option>
            <option value="activity">Harjoitus</option>
          </select>
          <button onClick={() => handleSort(sortField)}>
            Järjestä {sortOrder === 'asc' ? 'laskevaan' : 'nousevaan'} järjestykseen
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Päivämäärä</th>
              <th>Harjoitus</th>
              <th>Kesto (min)</th>
              <th>Asiakas</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id}>
                <td>{format(new Date(training.date), 'dd.MM.yyyy HH:mm')}</td>
                <td>{training.activity}</td>
                <td>{training.duration}</td>
                <td>{getCustomerName(training.customer ? training.customer.id : null)}</td>
                <td>
                  <button onClick={() => handleEditTraining(training)}>Muokkaa</button>
                  <button onClick={() => handleDeleteTraining(training.id)}>Poista</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Lomake uuden harjoituksen lisäämiseen tai muokkaamiseen */}
        <h2>{editTraining ? 'Muokkaa harjoitusta' : 'Lisää uusi harjoitus'}</h2>
        <div>
          <input
            type="datetime-local"
            value={newTraining.date}
            onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Kesto (min)"
            value={newTraining.duration}
            onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
          />
          <input
            type="text"
            placeholder="Harjoitus"
            value={newTraining.activity}
            onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
          />
          <select
            value={newTraining.customerId}
            onChange={(e) => setNewTraining({ ...newTraining, customerId: e.target.value })}
          >
            <option value="">Valitse asiakas</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstname} {customer.lastname}
              </option>
            ))}
          </select>
          <button onClick={editTraining ? handleUpdateTraining : handleEditTraining}>
            {editTraining ? 'Päivitä harjoitus' : 'Lisää harjoitus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingList;
