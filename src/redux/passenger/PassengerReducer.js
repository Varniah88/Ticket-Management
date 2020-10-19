import {
  GET_PASSENGER_FAILURE,
  GET_PASSENGER_REQUEST,
  GET_PASSENGER_SUCCESS,
  ADD_PASSENGER_AUTH_FAILURE,
  ADD_PASSENGER_AUTH_REQUEST,
  ADD_PASSENGER_AUTH_SUCCESS,
  ADD_CREDIT_FAILUER,
  ADD_CREDIT_REQUEST,
  ADD_CREDIT_SUCCESS,
  GEN_TOKEN_FAILURE,
  GEN_TOKEN_REQUEST,
  GEN_TOKEN_SUCCESS,
  GET_TOKEN_FAILURE,
  GET_TOKEN_REQUEST,
  GET_TOKEN_SUCCESS,
  ADD_TRAVEL_FAILURE,
  ADD_TRAVEL_REQUEST,
  ADD_TRAVEL_SUCCESS,
  GET_FOREIGN_PASSENGER_FAILURE,
  GET_FOREIGN_PASSENGER_REQUEST,
  GET_FOREIGN_PASSENGER_SUCCESS,
  GET_CREDIT_FAILUER,
  GET_CREDIT_REQUEST,
  GET_CREDIT_SUCCESS,
  GET_TRAVEL_FAILURE,
  GET_TRAVEL_REQUEST,
  GET_TRAVEL_SUCCESS,
} from "./PassengerType";

import Cookie from "js-cookie";
const authLength = Cookie.getJSON("authorizedUser") || [];

const view_Passengers = (
  state = { loading: true, passengers: [], error: "" },
  action
) => {
  switch (action.type) {
    case GET_PASSENGER_REQUEST:
      return { ...state, loading: true };
    case GET_PASSENGER_SUCCESS:
      return {
        ...state,
        loading: false,
        passengers: action.payload,
        error: "",
      };
    case GET_PASSENGER_FAILURE:
      return { ...state, loading: false, passengers: [], error: action.error };
    default:
      return state;
  }
};

const view_TravelsReducer = (
  state = { loading: true, travels: [], error: "" },
  action
) => {
  switch (action.type) {
    case GET_TRAVEL_REQUEST:
      return { ...state, loading: true };
    case GET_TRAVEL_SUCCESS:
      return {
        ...state,
        loading: false,
        travels: action.payload,
        error: "",
      };
    case GET_TRAVEL_FAILURE:
      return { ...state, loading: false, travels: [], error: action.error };
    default:
      return state;
  }
};

const view_PassengerCreditsReducer = (
  state = { loading: true, credits: [], error: "" },
  action
) => {
  switch (action.type) {
    case GET_CREDIT_REQUEST:
      return { ...state, loading: true };
    case GET_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        credits: action.payload,
        error: "",
      };
    case GET_CREDIT_FAILUER:
      return { ...state, loading: false, credits: [], error: action.error };
    default:
      return state;
  }
};

const view_ForeignPassengersReducer = (
  state = { loading: true, foreign_passengers: [], error: "" },
  action
) => {
  switch (action.type) {
    case GET_FOREIGN_PASSENGER_REQUEST:
      return { ...state, loading: true };
    case GET_FOREIGN_PASSENGER_SUCCESS:
      return {
        ...state,
        loading: false,
        foreign_passengers: action.payload,
        error: "",
      };
    case GET_FOREIGN_PASSENGER_FAILURE:
      return {
        ...state,
        loading: false,
        foreign_passengers: [],
        error: action.error,
      };
    default:
      return state;
  }
};

const view_TokenReducer = (
  state = { loading: true, tokens: [], error: "" },
  action
) => {
  switch (action.type) {
    case GET_TOKEN_REQUEST:
      return { ...state, loading: true };
    case GET_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        tokens: action.payload,
        error: "",
      };
    case GET_TOKEN_FAILURE:
      return { ...state, loading: false, tokens: [], error: action.error };
    default:
      return state;
  }
};

const add_passengerAuthReducer = (
  state = {
    loading: true,
    isAuth: authLength.length > 0 ? true : false,
    error: "",
  },
  action
) => {
  switch (action.type) {
    case ADD_PASSENGER_AUTH_REQUEST:
      return { ...state, loading: true };
    case ADD_PASSENGER_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuth: action.payload,
        error: "",
      };
    case ADD_PASSENGER_AUTH_FAILURE:
      return { ...state, loading: false, isAuth: false, error: action.error };
    default:
      return state;
  }
};

const add_CreditReducer = (
  state = { loading: true, credit: {}, error: "" },
  action
) => {
  switch (action.type) {
    case ADD_CREDIT_REQUEST:
      return { ...state, loading: true };
    case ADD_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        credit: action.payload,
        error: "",
      };
    case ADD_CREDIT_FAILUER:
      return { ...state, loading: false, credit: {}, error: action.error };
    default:
      return state;
  }
};

const add_TokenReducer = (
  state = { loading: true, token: {}, error: "" },
  action
) => {
  switch (action.type) {
    case GEN_TOKEN_REQUEST:
      return { ...state, loading: true };
    case GEN_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload,
        error: "",
      };
    case GEN_TOKEN_FAILURE:
      return { ...state, loading: false, token: {}, error: action.error };
    default:
      return state;
  }
};

const add_TravelReducer = (
  state = { loading: true, travel: {}, error: "" },
  action
) => {
  switch (action.type) {
    case ADD_TRAVEL_REQUEST:
      return { ...state, loading: true };
    case ADD_TRAVEL_SUCCESS:
      return {
        ...state,
        loading: false,
        travel: action.payload,
        error: "",
      };
    case ADD_TRAVEL_FAILURE:
      return { ...state, loading: false, travel: {}, error: action.error };
    default:
      return state;
  }
};

export {
  view_Passengers,
  add_passengerAuthReducer,
  add_CreditReducer,
  add_TokenReducer,
  view_TokenReducer,
  add_TravelReducer,
  view_ForeignPassengersReducer,
  view_PassengerCreditsReducer,
  view_TravelsReducer,
};
