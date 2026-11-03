export type Booking = {
    id: string;
    userId: string;
    providerId: string;
    subServiceId: string;
    subService: {
        id: string;
        categoryId: string;
        name: string;
        slug: string;
        basePriceCents: number;
        baseDurationMinutes: number;
        sortOrder: number;
    };
    scheduledAt: string;
    durationMinutes: number;
    priceCents: number;
    status: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

export type HistoryBooking = {
    id: string;
    service: string;
    date: string;
    provider: string;
    price: string;
    status: string;
    image?: string;
};
