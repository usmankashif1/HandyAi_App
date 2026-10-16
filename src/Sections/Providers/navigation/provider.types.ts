import type { AuthStackParamList } from '../../Customers/navigation/auth/auth.types';

export type ProviderStackParamList = AuthStackParamList & {
    ProviderOnboarding: undefined;
    ProviderDashboard: undefined;
};

export type ProviderTabParamList = {
    Jobs: undefined;
    Schedule: undefined;
    Earnings: undefined;
    Profile: undefined;
};
