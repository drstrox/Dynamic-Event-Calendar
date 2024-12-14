import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../components/components/ui/dialog';
import { Input } from '../components/components/ui/input';
import { Button } from '../components/components/ui/button';
import { format } from 'date-fns';
import useEventStore from '../stores/eventStore';
import { Event } from '../types/event';
import { Trash2 } from 'lucide-react';

interface EventModalProps {
  date: Date;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ date, onClose }) => {
  const { addEvent, getEventsForDate, deleteEvent } = useEventStore();
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const events = getEventsForDate(date);

  const handleAddEvent = () => {
    // Basic validation
    if (!eventName || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for time conflict
    const hasConflict = events.some(event => 
      (startTime >= event.startTime && startTime < event.endTime) ||
      (endTime > event.startTime && endTime <= event.endTime)
    );

    if (hasConflict) {
      alert('This event conflicts with an existing event');
      return;
    }

    const newEvent: Event = {
      id: uuidv4(),
      name: eventName,
      date,
      startTime,
      endTime,
      description
    };

    addEvent(newEvent);
    
    // Reset form
    setEventName('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            Events for {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Input
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="col-span-1"
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-1"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-1"
            />
          </div>
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleAddEvent}>Add Event</Button>

          {events.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Existing Events:</h3>
              {events.map(event => (
                <div 
                  key={event.id} 
                  className="flex justify-between items-center mb-2 p-2 border rounded"
                >
                  <div>
                    <strong>{event.name}</strong>
                    <div className="text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.description && (
                      <div className="text-xs text-gray-500">
                        {event.description}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;