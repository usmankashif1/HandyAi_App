export type UserProfile = {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    fullName: string;
    address: string | null;
    postcode: string | null;
    photoUrl: string | null;
    householdNotes: string | null;
    createdAt: string;
    updatedAt: string;
};

export type UpdateProfileRequest = Pick<
    UserProfile,
    'fullName' | 'address' | 'postcode' | 'householdNotes'
>;

export type ProfileStackParamList = {
    ProfileHome: undefined;
    UpdateProfile: undefined;
};
