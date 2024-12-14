import React from 'react';
import EventCalendar from './components/EventCalendar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Dynamic Event Calendar
        </h1>
        <EventCalendar />
      </div>
    </div>
  );
};

export default App;