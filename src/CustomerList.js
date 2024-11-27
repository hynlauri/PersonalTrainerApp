import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [sortField, setSortField] = useState('firstname');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ firstname: '', lastname: '', email: '' });

  useEffect(() => {
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/getcustomers')
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Asiakkaiden haku epäonnistui:', error);
      });
  }, []);

  const handleSort = (field) => {
    const sorted = [...customers].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });
    setCustomers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleAddCustomer = () => {
    axios
      .post('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', newCustomer)
      .then((response) => {
        setCustomers([...customers, response.data]);
        setNewCustomer({ firstname: '', lastname: '', email: '' });
      })
      .catch((error) => {
        console.error('Asiakkaan lisääminen epäonnistui:', error);
      });
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Oletko varma, että haluat poistaa tämän asiakkaan?')) {
      axios
        .delete(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${customerId}`)
        .then(() => {
          setCustomers(customers.filter((customer) => customer.id !== customerId));
        })
        .catch((error) => {
          console.error('Asiakkaan poisto epäonnistui:', error);
        });
    }
  };

  const handleUpdateCustomer = () => {
    if (selectedCustomer) {
      // Lähetetään PUT-pyyntö backendille
      axios
        .put(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${selectedCustomer.id}`, selectedCustomer)
        .then((response) => {
          // Päivitetään asiakaslistaa
          setCustomers(customers.map((customer) => (customer.id === selectedCustomer.id ? response.data : customer)));
          setSelectedCustomer(null); // Tyhjennetään valittu asiakas
        })
        .catch((error) => {
          console.error('Asiakkaan muokkaus epäonnistui:', error);
        });
    }
  };

  const handleSelectCustomer = (customer) => {
    // Valitaan asiakas muokattavaksi
    setSelectedCustomer({ ...customer });
  };

  return (
    <div>
      <h1>Asiakastiedot</h1>
      <div>
        <label>Järjestä:</label>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="firstname">Etunimi</option>
          <option value="lastname">Sukunimi</option>
          <option value="email">Sähköposti</option>
        </select>
        <button onClick={() => handleSort(sortField)}>
          Järjestä {sortOrder === 'asc' ? 'laskevaan' : 'nousevaan'} järjestykseen
        </button>
      </div>

      {/* Lisää asiakas */}
      <div>
        <h2>Lisää uusi asiakas</h2>
        <input
          type="text"
          placeholder="Etunimi"
          value={newCustomer.firstname}
          onChange={(e) => setNewCustomer({ ...newCustomer, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sukunimi"
          value={newCustomer.lastname}
          onChange={(e) => setNewCustomer({ ...newCustomer, lastname: e.target.value })}
        />
        <input
          type="email"
          placeholder="Sähköposti"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <button onClick={handleAddCustomer}>Lisää asiakas</button>
      </div>

      {/* Asiakkaan muokkaus */}
      {selectedCustomer && (
        <div>
          <h2>Muokkaa asiakasta</h2>
          <input
            type="text"
            value={selectedCustomer.firstname}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, firstname: e.target.value })}
          />
          <input
            type="text"
            value={selectedCustomer.lastname}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, lastname: e.target.value })}
          />
          <input
            type="email"
            value={selectedCustomer.email}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
          />
          <button onClick={handleUpdateCustomer}>Tallenna muutokset</button>
        </div>
      )}

      {/* Asiakaslista */}
      <table>
        <thead>
          <tr>
            <th>Etunimi</th>
            <th>Sukunimi</th>
            <th>Sähköposti</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.firstname}</td>
              <td>{customer.lastname}</td>
              <td>{customer.email}</td>
              <td>
                <button onClick={() => handleSelectCustomer(customer)}>Muokkaa</button>
                <button onClick={() => handleDeleteCustomer(customer.id)}>Poista</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
