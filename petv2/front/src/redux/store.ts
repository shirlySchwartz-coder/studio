import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "./reducers/authReducer";
import animalReducer from "./reducers/animalReducer";
import uploadReducer from "./reducers/uploadReducer";


 const store = configureStore({
    reducer: {
     auth: authReducer,
     animals: animalReducer,
     upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;