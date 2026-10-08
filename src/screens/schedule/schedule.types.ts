export type ScheduleStackParamList = {
    ScheduleHome: undefined;
    ProviderChat: {
        providerName: string;
    };
};

export type ScheduleBookingStatus = 'Confirmed' | 'Provider on the way';

export type ScheduleBooking = {
    id: string;
    service: string;
    provider: string;
    providerName: string;
    time: string;
    status: ScheduleBookingStatus;
    image: string;
};

export type ScheduleBookingGroup = {
    date: string;
    bookings: ScheduleBooking[];
};
