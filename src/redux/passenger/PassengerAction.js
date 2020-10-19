import { db } from "../../firebase";
import firebase from "firebase";
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

const viewPassengers = () => {
  return async (dispatch) => {
    dispatch({ type: GET_PASSENGER_REQUEST });
    try {
      db.collection("localPassengers")
        .onSnapshot(async (snapshot) => {
          const tempData = await snapshot.docs.map((doc) => ({
            accountNo: doc.data().accountNo,
            balance: doc.data().credit,
            name: doc.data().name,
            id: doc.id,
          }));
          console.log("getTemp Data", tempData);
          dispatch({
            type: GET_PASSENGER_SUCCESS,
            payload: tempData,
          });
        })
        .catch((err) => {
          dispatch({
            type: GET_PASSENGER_FAILURE,
            error: err,
          });
        });
    } catch (err) {
      dispatch({
        type: GET_PASSENGER_FAILURE,
        error: err,
      });
    }
  };
};

const viewForeignPassengers = () => {
  return async (dispatch) => {
    dispatch({ type: GET_FOREIGN_PASSENGER_REQUEST });
    try {
      db.collection("foreignPassengers")
        .onSnapshot(async (snapshot) => {
          const tempData = await snapshot.docs.map((doc) => ({
            passportNo: doc.data().passportNo,
            name: doc.data().name,
            id: doc.id,
          }));
          console.log("getTemp Data", tempData);
          dispatch({
            type: GET_FOREIGN_PASSENGER_SUCCESS,
            payload: tempData,
          });
        })
        .catch((err) => {
          dispatch({
            type: GET_FOREIGN_PASSENGER_FAILURE,
            error: err,
          });
        });
    } catch (err) {
      dispatch({
        type: GET_FOREIGN_PASSENGER_FAILURE,
        error: err,
      });
    }
  };
};

const viewPassengerCredits = () => {
  return async (dispatch) => {
    dispatch({ type: GET_CREDIT_REQUEST });
    try {
      db.collection("passengerCredits")
        .onSnapshot(async (snapshot) => {
          const tempData = await snapshot.docs.map((doc) => ({
            accountNo: doc.data().accountNo,
            balance: doc.data().balance,
            credit: doc.data().credit,
            paymentType: doc.data().paymentType,
            id: doc.id,
            time: doc.data().timestamp,
          }));
          console.log("getTemp Data", tempData);
          dispatch({
            type: GET_CREDIT_SUCCESS,
            payload: tempData,
          });
        })
        .catch((err) => {
          dispatch({
            type: GET_CREDIT_FAILUER,
            error: err,
          });
        });
    } catch (err) {
      dispatch({
        type: GEN_TOKEN_FAILURE,
        error: err,
      });
    }
  };
};

const addPassengerRequest = (isAuth) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PASSENGER_AUTH_REQUEST });
    try {
      dispatch({
        type: ADD_PASSENGER_AUTH_SUCCESS,
        payload: isAuth,
      });
    } catch (err) {
      dispatch({
        type: ADD_PASSENGER_AUTH_FAILURE,
        error: err,
      });
    }
  };
};

const genToken = (data, collectionType) => {
  return async (dispatch) => {
    dispatch({ type: GEN_TOKEN_REQUEST });
    try {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      db.collection(collectionType)
        .doc(data.id)
        .collection("tokens")
        .add({
          ...data,
          timestamp,
        })
        .then(() => {
          dispatch({
            type: GEN_TOKEN_SUCCESS,
            payload: { ...data, timestamp },
          });
        })
        .catch((err) => {
          dispatch({
            type: GEN_TOKEN_FAILURE,
            error: err,
          });
        });
    } catch (err) {}
  };
};

const getTravels = (docId, collectionType, tid) => {
  return async (dispatch) => {
    dispatch({ type: GET_TRAVEL_REQUEST });
    try {
      db.collection(collectionType)
        .doc(docId)
        .collection("tokens")
        .doc(tid)
        .collection("travels")
        .onSnapshot((snapshot) => {
          const tempData = snapshot.docs.map((doc) => ({
            id: doc.id,
            balance: doc.data().balance,
            distance: doc.data().distance,
            endPoint: doc.data().endPoint,
            startPoint: doc.data().startPoint,
            price: doc.data().price,
          }));

          dispatch({
            type: GET_TRAVEL_SUCCESS,
            payload: tempData,
          });
        });
    } catch (err) {
      dispatch({
        type: GET_TRAVEL_FAILURE,
        error: err,
      });
    }
  };
};

const addTravel = (data, collectionType, tid) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TRAVEL_REQUEST });
    try {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      db.collection(collectionType)
        .doc(data.id)
        .set(
          {
            credit: parseInt(data.balance) - parseInt(data.price),
          },
          { merge: true }
        )
        .then(() => {
          db.collection(collectionType)
            .doc(data.id)
            .collection("tokens")
            .doc(tid)
            .collection("travels")
            .add({
              ...data,
              timestamp,
            })
            .then(() => {
              dispatch({
                type: ADD_TRAVEL_SUCCESS,
                payload: { ...data, timestamp },
              });
            })
            .catch((err) => {
              dispatch({
                type: ADD_TRAVEL_FAILURE,
                error: err,
              });
            });
        })
        .catch((err) => {
          dispatch({
            type: ADD_TRAVEL_FAILURE,
            error: err,
          });
        });
    } catch (err) {
      dispatch({
        type: ADD_TRAVEL_FAILURE,
        error: err,
      });
    }
  };
};

const addCredit = (data, docId) => {
  return async (dispatch) => {
    dispatch({ type: ADD_CREDIT_REQUEST });
    try {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      db.collection("localPassengers")
        .doc(docId)
        .set(
          {
            credit: parseInt(data.balance) + parseInt(data.credit),
          },
          {
            merge: true,
          }
        )
        .then(() => {
          db.collection("passengerCredits")
            .add({
              ...data,
              timestamp,
            })
            .then(() => {
              dispatch({
                type: ADD_CREDIT_SUCCESS,
                payload: {
                  ...data,
                  timestamp,
                },
              });
            })
            .catch((err) => {
              dispatch({
                type: ADD_CREDIT_FAILUER,
                error: err,
              });
            });
        })
        .catch((err) => {
          dispatch({
            type: ADD_CREDIT_FAILUER,
            error: err,
          });
        });
    } catch (err) {}
  };
};

const getToken = (collectionType, docId) => {
  return async (dispatch) => {
    dispatch({ type: GET_TOKEN_REQUEST });
    try {
      db.collection(collectionType)
        .doc(docId)
        .collection("tokens")
        .onSnapshot((snapshot) => {
          const tempData = snapshot.docs.map((doc) => ({
            id: doc.id,
            tokenValue: doc.data().tokenValue,
            validity: doc.data().validity,
            time: doc.data().timestamp,
          }));

          dispatch({
            type: GET_TOKEN_SUCCESS,
            payload: tempData,
          });
        });
    } catch (err) {
      dispatch({
        type: GEN_TOKEN_FAILURE,
        error: err,
      });
    }
  };
};

export {
  viewPassengers,
  addPassengerRequest,
  addCredit,
  genToken,
  getToken,
  addTravel,
  viewForeignPassengers,
  viewPassengerCredits,
  getTravels,
};
