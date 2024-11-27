import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Alustetaan lokalisoija momentin avulla
const localizer = momentLocalizer(moment);

const TrainingCalendar = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    // Hae harjoitustiedot palvelimelta
    axios
      .get('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings') // Korvaa oikealla API-osoitteella
      .then((response) => {
        const formattedTrainings = response.data.map((training) => ({
          title: `${training.activity} (${training.duration} min)`,
          start: new Date(training.date), // Muunnetaan päivämäärä oikeaan formaattiin
          end: new Date(new Date(training.date).getTime() + training.duration * 60000), // Lisätään kesto
          allDay: false,
        }));
        setTrainings(formattedTrainings); // Tallennetaan harjoitukset tilaan
      })
      .catch((error) => {
        console.error('Harjoitusten haku epäonnistui:', error);
      });
  }, []);

  return (
    <div>
      <h1>Harjoitukset Kalenterissa</h1>
      <Calendar
  localizer={localizer}
  events={trainings}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, width: '100%' }} // Aseta korkeus ja leveys
/>
    </div>
  );
};

export default TrainingCalendar;
