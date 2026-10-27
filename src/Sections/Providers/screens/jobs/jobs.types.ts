export type ProviderJob = {
    id: string;
    category: 'Cleaning' | 'Handyman';
    title: string;
    jobNumber: string;
    date: string;
    time: string;
    location: string;
    fullAddress: string;
    distance: string;
    duration: string;
    price: string;
    rating: string;
    reviews: string;
    clientName: string;
    description: string[];
    status?: string;
};

export type ProviderJobsStackParamList = {
    JobList: undefined;
    JobDetails: { job: ProviderJob };
    ClientChat: { clientName: string };
    Notifications: undefined;
};
