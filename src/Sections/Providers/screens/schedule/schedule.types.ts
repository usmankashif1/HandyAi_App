export type ScheduleCategory = 'All' | 'Cleaning' | 'Plumbing' | 'Handyman';

export type ScheduleAppointment = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    service: Exclude<ScheduleCategory, 'All'>;
    customer: string;
    location: string;
    rating: string;
    accentColor: string;
};
