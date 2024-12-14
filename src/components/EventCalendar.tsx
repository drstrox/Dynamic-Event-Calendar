import React, { useState } from 'react';
import { 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isToday 
} from 'date-fns';
import { Button } from '../components/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventModal from './EventModal';
import useEventStore from '../stores/eventStore';

const EventCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { events } = useEventStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const renderCalendarDays = () => {
    return calendarDays.map((day, index) => {
      const dayEvents = events.filter(
        event => event.date.toDateString() === day.toDateString()
      );

      return (
        <div 
          key={index}
          className={`
            p-2 border text-center cursor-pointer 
            ${!isSameMonth(day, currentMonth) ? 'bg-gray-100 text-gray-400' : ''}
            ${isToday(day) ? 'bg-blue-100 font-bold' : ''}
            ${selectedDate?.toDateString() === day.toDateString() ? 'bg-blue-200' : ''}
            hover:bg-blue-50 transition-colors
          `}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex justify-between items-center">
            <span>{format(day, 'd')}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs text-blue-600 bg-blue-100 rounded-full px-2">
                {dayEvents.length}
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline"
          onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button 
          variant="outline"
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-gray-600">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <EventModal 
          date={selectedDate} 
          onClose={() => setSelectedDate(null)} 
        />
      )}
    </div>
  );
};

export default EventCalendar;