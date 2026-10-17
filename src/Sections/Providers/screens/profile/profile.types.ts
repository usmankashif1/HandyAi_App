import type { ProviderProfile } from './providerProfile.api';

export type ProviderProfileStackParamList = {
    ProfileHome: undefined;
    ProviderSettings: { profile?: ProviderProfile } | undefined;
};
