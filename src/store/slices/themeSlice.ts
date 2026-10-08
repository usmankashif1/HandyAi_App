// import { defaultTheme } from "@/src/core/theme/defaultTheme";
// import { Theme } from "@/src/core/theme/themeTypes";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: Theme = defaultTheme;

// const themeSlice = createSlice({
//     name: "theme",
//     initialState,

//     reducers: {
//         setTheme: (
//             state,
//             action: PayloadAction<Partial<Theme>>
//         ) => {
//             return {
//                 ...state,
//                 ...action.payload,
//             };
//         },

//         resetTheme: () => defaultTheme,
//     },
// });

// export const {
//     setTheme,
//     resetTheme,
// } = themeSlice.actions;

// export default themeSlice.reducer;