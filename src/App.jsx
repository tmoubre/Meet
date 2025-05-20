import React from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberofEvents';



// App component that renders the CitySearch and EventList components
const App = () => {
  return (
    <div>
      <CitySearch />
      <EventList />
      <NumberOfEvents />
    </div>
  );
 }

 
 export default App;
