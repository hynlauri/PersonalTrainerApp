import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Käytetään date-fns päivämäärän muotoiluun

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

  useEffect(() => {
    // Ladataan harjoitukset
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
      .then((response) => {
        setTrainings(response.data);
        console.log('Harjoitustiedot ladattu:', response.data); // Näytetään harjoitustiedot konsolissa
      })
      .catch((error) => {
        console.error('Harjoitusten haku epäonnistui:', error);
      });

    // Ladataan asiakkaat
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/getcustomers')
      .then((response) => {
        setCustomers(response.data);
        console.log('Asiakastiedot ladattu:', response.data); // Näytetään asiakastiedot konsolissa
      })
      .catch((error) => {
        console.error('Asiakastiedon haku epäonnistui:', error);
      });
  }, []);

  // Asiakkaan nimen hakeminen harjoitustiedosta
  const getCustomerName = (customerId) => {
    if (!customerId) {
      return 'Ei asiakasta'; // Jos customerId on null tai undefined, palauta 'Ei asiakasta'
    }

    const customer = customers.find((customer) => customer.id === customerId);
    if (!customer) {
      console.log(`Ei asiakasta löytynyt ID:llä ${customerId}`); // Näytetään viesti, jos asiakasta ei löydy
      return 'Ei asiakasta';
    }

    return `${customer.firstname} ${customer.lastname}`;
  };

  // Lajittelufunktio
  const handleSort = (field) => {
    const sorted = [...trainings].sort((a, b) => {
      // Jos lajittelemme päivämäärän mukaan
      if (field === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      // Jos lajittelemme harjoituksen nimen mukaan
      if (field === 'activity') {
        return sortOrder === 'asc'
          ? a.activity.localeCompare(b.activity)
          : b.activity.localeCompare(a.activity);
      }
      return 0; // Oletuslajittelu
    });
    
    setTrainings(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Vaihdetaan lajittelujärjestys
  };

  // Harjoituksen lisääminen
  const handleAddTraining = () => {
    // Tarkistetaan, että asiakas on valittu ennen lomakkeen lähettämistä
    if (!newTraining.customerId) {
      alert('Valitse asiakas ennen harjoituksen lisäämistä!');
      return; // Ei lähetetä lomaketta, jos asiakas on puuttuva
    }

    // Lähetetään uusi harjoitus back-endiin
    axios
      .post('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', newTraining)
      .then((response) => {
        setTrainings([...trainings, response.data]); // Lisää uusi harjoitus listaan
        setNewTraining({
          date: '',
          duration: '',
          activity: '',
          customerId: '',
        }); // Tyhjennetään lomake
        console.log('Harjoitus lisätty:', response.data);
      })
      .catch((error) => {
        console.error('Harjoituksen lisäys epäonnistui:', error);
      });
  };

  // Harjoituksen poistaminen
  const handleDeleteTraining = (id) => {
    // Lähetetään DELETE-pyyntö harjoituksen poistamiseksi
    axios
      .delete(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${id}`)
      .then((response) => {
        // Poistetaan harjoitus tilasta sen id:n perusteella
        setTrainings(trainings.filter(training => training.id !== id));
        console.log('Harjoitus poistettu:', id);
      })
      .catch((error) => {
        console.error('Harjoituksen poisto epäonnistui:', error);
      });
  };

  return (
    <div>
      <h1>Harjoitustiedot</h1>
      {customers.length === 0 ? (
        <p>Ladataan asiakastiedot...</p>
      ) : (
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
                    <button onClick={() => {/* Lisää muokkaustoiminto */}}>Muokkaa</button>
                    <button onClick={() => handleDeleteTraining(training.id)}>Poista</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Lomake uuden harjoituksen lisäämiseen */}
          <h2>Lisää uusi harjoitus</h2>
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
            <button onClick={handleAddTraining}>Lisää harjoitus</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingList;
