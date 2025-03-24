import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Paper, Stack } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';

function renderEventContent(eventInfo) {
    return (
        <>
            <b className='mr-[3px]'>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

function renderSidebarEvent(event) {
    return (
        <li key={event.id}>
            <b className='mr-[3px]'>
                {formatDate(event.start, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </b>
            <i>{event.title}</i>
        </li>
    );
}


export default function Calendar() {

    const [weekendsVisible, setweekendsVisible] = useState(true);
    const [currentEvents, setcurrentEvents] = useState([]);

    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("currentMode");
        return saved || "light";
    });


    useEffect(() => {
        document.documentElement.className = mode;
        localStorage.setItem("currentMode", mode);
    }, [mode]);

    const handleWeekendsToggle = () => {
        setweekendsVisible(!weekendsVisible);
    };

    let eventGuid = 0;
    function createEventId() {
        return String(eventGuid++);
    }

    const handleDateSelect = (selectInfo) => {
        let title = prompt("Please enter a new title for your event");
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };
    const handleEventClick = (clickInfo) => {
        if (window.confirm(
            `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )) {
            clickInfo.event.remove();
        }
    };

    const handleEvents = (events) => {
        setcurrentEvents(events);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };


    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>


            <Stack direction="row" className="min-h-full font-sans text-sm">
                <TopBar open={open}
                    handleDrawerOpen={handleDrawerOpen} setMode={setMode} mode={mode} />


                <SideBar open={open} handleDrawerClose={handleDrawerClose} />
                <Paper
                    className="w-[300px] leading-relaxed border-r border-[#d3e2e8] p-4"
                    elevation={0}
                >
                    <h2 className="text-center mb-4 text-lg font-semibold">
                        All Events ({currentEvents.length})
                    </h2>
                    <ul className="space-y-2 pl-2">{currentEvents.map(renderSidebarEvent)}</ul>
                </Paper>

                <div className="flex-grow p-8">
                    <div className="max-w-[1100px] mx-auto">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            initialView="dayGridMonth"
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={weekendsVisible}
                            select={handleDateSelect}
                            eventContent={renderEventContent}
                            eventClick={handleEventClick}
                            eventsSet={handleEvents}

                        />
                    </div>
                </div>
            </Stack>
        </>
    )
}
