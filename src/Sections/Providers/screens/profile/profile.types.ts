import type { ProviderProfile } from './providerProfile.api';

export type ProviderProfileStackParamList = {
    ProfileHome: undefined;
    ProviderSettings: { profile?: ProviderProfile } | undefined;
    ProviderPersonalInformation: { profile: ProviderProfile };
    ProviderServiceAreas: { profile: ProviderProfile };
    ProviderAvailability: { profile: ProviderProfile };
    ProviderDocuments: { profile: ProviderProfile };
    ProviderPaymentDetails: { profile: ProviderProfile };
};
