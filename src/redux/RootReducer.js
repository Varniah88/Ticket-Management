import { combineReducers } from "redux";
import { view_Passengers, add_passengerAuthReducer, add_CreditReducer, add_TokenReducer, view_TokenReducer, add_TravelReducer,view_ForeignPassengersReducer,view_PassengerCreditsReducer,view_TravelsReducer } from './passenger/PassengerReducer';

const rootReducer = combineReducers({
    view_Travels:view_TravelsReducer,
    view_PassengerCredit:view_PassengerCreditsReducer,
    view_ForeignPassengers: view_ForeignPassengersReducer,
    add_Travel: add_TravelReducer,
    view_Tokens: view_TokenReducer,
    view_Passengers: view_Passengers,
    add_passengerAuth: add_passengerAuthReducer,
    add_Credit: add_CreditReducer,
    add_Token: add_TokenReducer
});

export default rootReducer;