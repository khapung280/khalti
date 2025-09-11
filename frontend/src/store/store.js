import {configureStore} from "@reduxjs/toolkit";
import khaltiSlice from "./KhaltiSlice"

const store=configureStore({
    reducer:{
        khalti:khaltiSlice
    }
})
export default store