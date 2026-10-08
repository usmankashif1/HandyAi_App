// import { readToken } from "@/src/core/utils/tokenStorage";
// import { configureStore } from "@reduxjs/toolkit";
// import organizationReducer, { setToken } from "./slices/organizationSlice";
// import themeReducer from "./slices/themeSlice";

// export const store = configureStore({
//     reducer: {
//         organization: organizationReducer,
//         theme: themeReducer,
//     },
// });

// const persistedToken = readToken();
// if (persistedToken) {
//     store.dispatch(setToken(persistedToken));
// }

// export type RootState = ReturnType<
//     typeof store.getState
// >;

// export type AppDispatch = typeof store.dispatch;