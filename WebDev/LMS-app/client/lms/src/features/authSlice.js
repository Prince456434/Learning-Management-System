import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user: null,
    isAuthenticated:false,
}
const authSlice=createSlice({
    name:"authSlice",  
    initialState,
    reducers:{
        //these two actions are dispatched
        userLoggedIN:(state,action)=>{
            state.user=action.payload.user; //data that is sent
            state.isAuthenticated=true;
        },
        userLoggedOut:(state)=>{
            state.user=null;
            state.isAuthenticated=false;
        }
    },
});
export const{userLoggedIN,userLoggedOut}=authSlice.actions;
export default authSlice.reducer;
