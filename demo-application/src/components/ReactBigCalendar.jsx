import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./react-big-calendar.css";
import { useQuery, useQueryClient } from '../cross-window-query-library';

moment.locale("fi-FI");
const localizer = momentLocalizer(moment);

export const BigCalendar = ({modificationEnabled}) =>  {
  const [eventsData, setEventsData] = useState([]);
  const { isLoading, isError, error, data } = useQuery({queryKey: ['calendar'], queryScript: 'getCalendar'})
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (data && !isLoading) {
      const updatedData = data.map(event=> {
        // first, create Date object
        const el = event.date.split('.')
        var newDate = new Date()
        newDate.setDate(el[0])
        newDate.setMonth(el[1]-1)
        newDate.setFullYear(el[2])

        // second, create starting date
        const start = newDate
        start.setHours(event.startTime.split('.')[0])
        start.setMinutes(0)
        start.setSeconds(0)

        // third, create ending date
        const end = start
        end.setHours(event.endTime.split('.')[0])

        // finally, create the events
        const title = event.title

        return {
          id: event.id,
          start,
          end,
          title,
        };
      });
      setEventsData(updatedData); 
    }
  }, [data]);

  const handleSelect = async ({ start, end }) => {
    const title = window.prompt("New Event title");
    const month = start.getMonth()+1
    const date = start.getDate() + '.' + month + '.' + start.getFullYear() 
    const startTime = start.getHours() + '.00'
    const endTime = start.getHours() + '.00'
    const requestBody = JSON.stringify({
      title: title,
      date: date, 
      startTime: startTime,
      endTime: endTime
    })
    if (title) {
      await fetch('api/calendar', {method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody})
    }
    queryClient.invalidateQuery(['calendar'])
  };

  const handleChange = async({ title, id }) => {
    const newTitle = window.prompt("Change event title");
    const requestBody = JSON.stringify({ title: newTitle })
    if (newTitle) {
      await fetch(`api/calendar/${id}`, {method: "PUT", headers: { "Content-Type": "application/json" }, body: requestBody})
    }
    queryClient.invalidateQuery(['calendar'])
  }

  return (
    <div className="Calendar">
        <div className="container">
            <h1>Calendar</h1>
        </div>
        <div className="big-calendar">
          <Calendar
            views={["day", "agenda", "work_week", "month"]}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={eventsData}
            style={{ height: "60vh",
                    margin: "0px 0px 50px 0px"
                  }}
            onSelectEvent={modificationEnabled && handleChange}
            onSelectSlot={modificationEnabled && handleSelect}
          />
        </div>
    </div>
  );
}
