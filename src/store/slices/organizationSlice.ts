

// import type { MembershipSubscription } from '@/src/screens/membership/membership.api';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export interface Organization {
//     id?: string;
//     name?: string;
//     logo_url?: string | null;
// }

// export interface Notification {
//     id: string;
//     gym_id?: string;
//     member_id?: string;
//     type?: string;
//     title?: string;
//     body?: string;
//     data?: Record<string, any>;
//     email_status?: string;
//     push_status?: string;
//     is_read: boolean;
//     read_at?: string | null;
//     created_at: string;
//     gym_name?: string;
//     gym_icon_url?: string;
// }

// interface OrganizationState {
//     token: string | null;
//     resetToken: string | null;
//     organization: Organization | null;
//     user: any | null;
//     attendanceDetails: any | null;
//     notificationCount: number;
//     membershipRefreshKey: number;
//     membership: MembershipSubscription | null;
// }

// const initialState: OrganizationState = {
//     token: null,
//     resetToken: null,
//     organization: null,
//     user: null,
//     attendanceDetails: null,
//     notificationCount: 0,
//     membershipRefreshKey: 0,
//     membership: null,
// };

// const organizationSlice = createSlice({
//     name: 'organization',
//     initialState,

//     reducers: {
//         setOrganization: (
//             state,
//             action: PayloadAction<Organization | null>
//         ) => {
//             state.organization = action.payload;
//         },

//         clearOrganization: state => {
//             state.organization = null;
//         },

//         setUser: (
//             state,
//             action: PayloadAction<any | null>
//         ) => {
//             state.user = action.payload;
//         },

//         clearUser: state => {
//             state.user = null;
//         },

//         setToken: (
//             state,
//             action: PayloadAction<string | null>
//         ) => {
//             state.token = action.payload;
//         },

//         removeToken: state => {
//             state.token = null;
//             state.notificationCount = 0;
//             state.organization = null;
//             state.user = null;
//             state.membership = null;
//         },

//         setAttendanceDetails: (state, action: PayloadAction<any | null>) => {
//             state.attendanceDetails = action.payload;
//         },

//         setNotificationCount: (state, action) => {
//             state.notificationCount = action.payload
//         },

//         setMembership: (state, action: PayloadAction<MembershipSubscription | null>) => {
//             state.membership = action.payload;
//         },

//         clearMembership: state => {
//             state.membership = null;
//         },

//         refreshMembership: state => {
//             state.membershipRefreshKey += 1;
//         },
//     }
// });

// export const {
//     setOrganization,
//     clearOrganization,
//     setToken,
//     removeToken,
//     setUser,
//     clearUser,
//     setAttendanceDetails,
//     setNotificationCount,
//     setMembership,
//     clearMembership,
//     refreshMembership,
// } = organizationSlice.actions;

// export default organizationSlice.reducer;