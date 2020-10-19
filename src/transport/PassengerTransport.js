import React, { useState, useEffect } from "react";
import "./PassengerTransport.css";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  getToken,
  viewPassengers,
  addTravel,
} from "../redux/passenger/PassengerAction";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase";
const PassengerTransport = () => {
  const authorizedUser = Cookie.getJSON("authorizedUser") || [];
  const { passengers } = useSelector((state) => state.view_Passengers);
  const curentPassenger = passengers.filter(
    (data) => data.accountNo === authorizedUser[0].accountNo
  );
  const dispatch = useDispatch();
  const { tokens } = useSelector((state) => state.view_Tokens);
  const [ptokens, setTokens] = useState([]);
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndpoint] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState("");
  const [tokenData, setTokenData] = useState([]);
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    dispatch(viewPassengers());
    dispatch(getToken("localPassengers", authorizedUser[0].id));
  }, []);

  useEffect(() => {
    console.log("worked");
    const unsubscribe = db
      .collection("localPassengers")
      .doc(curentPassenger.length > 0 ? curentPassenger[0]?.id : "0")
      .collection("tokens")
      .onSnapshot((snapshot) => {
        console.log("working...");
        setTokenData(
          snapshot.docs.map((doc) => ({
            validity: new Date(doc.data().validity?.toDate()),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [passengers]);

  useEffect(() => {
    const unsubscribe = setInterval(() => {
      if (tokenData.length > 0) {
        let ptime = new Date();
        Date(ptime.setDate(ptime.getDate()));
        if ((tokenData[tokenData.length - 1].validity - ptime) / 1000 > 0) {
          let res =
            Math.abs(tokenData[tokenData.length - 1].validity - ptime) / 1000;
          let days = Math.floor(res / 86400);
          let hours = Math.floor(res / 3600) % 24;
          let minutes = Math.floor(res / 60) % 60;
          let seconds = res % 60;
          console.log("hours", hours);
          setTimer({
            days,
            hours,
            minutes,
            seconds,
          });
        } else {
          setTimer({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
        }
      }
    }, 1000);
    return () => {
      clearInterval(unsubscribe);
    };
  }, [tokenData.length]);

  useEffect(() => {
    console.log("tokens", tokens);
    setTokens(tokens);
  }, [tokens]);

  useEffect(() => {
    if (startPoint === endPoint) {
      setDistance(0);
      setPrice(0);
    } else if (startPoint === "" && endPoint === "") {
      setDistance(0);
      setPrice(0);
    } else if (startPoint === "Jaffna" && endPoint === "Vavunija") {
      setDistance(150);
      setPrice(200);
    } else if (startPoint === "Jaffna" && endPoint === "Anuradhapura") {
      setDistance(200);
      setPrice(300);
    } else if (startPoint === "Jaffna" && endPoint === "Kurunagala") {
      setDistance(220);
      setPrice(350);
    } else if (startPoint === "Vavunija" && endPoint === "Jaffna") {
      setDistance(150);
      setPrice(200);
    } else if (startPoint === "Vavunija" && endPoint === "Anuradhapura") {
      setDistance(50);
      setPrice(100);
    } else if (startPoint === "Vavunija" && endPoint === "Kurunagala") {
      setDistance(90);
      setPrice(180);
    } else if (startPoint === "Anuradhapura" && endPoint === "Jaffna") {
      setDistance(200);
      setPrice(300);
    } else if (startPoint === "Anuradhapura" && endPoint === "Vavunija") {
      setDistance(50);
      setPrice(100);
    } else if (startPoint === "Anuradhapura" && endPoint === "Kurunagala") {
      setDistance(30);
      setPrice(80);
    } else if (startPoint === "Kurunagala" && endPoint === "Anuradhapura") {
      setDistance(30);
      setPrice(80);
    } else if (startPoint === "Kurunagala" && endPoint === "Vavunija") {
      setDistance(90);
      setPrice(180);
    } else if (startPoint === "Kurunagala" && endPoint === "Jaffna") {
      setDistance(220);
      setPrice(350);
    }
  }, [startPoint, endPoint]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(curentPassenger[0].balance);

    if (price > curentPassenger[0].balance) {
      toast.error("Insufficent balance", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.success("!!Sucessfully added", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      dispatch(
        addTravel(
          {
            id: curentPassenger[0]?.id,
            startPoint,
            endPoint,
            distance,
            price,
            balance: curentPassenger[0]?.balance,
          },
          "localPassengers",
          ptokens[0].id
        )
      );
    }

    setDistance("");
    setEndpoint("");
    setPrice("");
    setStartPoint("");
  };
  return (
    <div className="PassengerTransport">
      <ToastContainer />
      <h6 className="text-white bg-dark pt-1">
        <span>Hi, {authorizedUser[0]?.name}</span>
        <span>Balance : LKR {curentPassenger[0]?.balance}</span>
        <span className="text-center">
          Token Validity : {timer?.hours} hrs {timer?.minutes} min{" "}
          {Math.floor(timer?.seconds)} sec
        </span>
      </h6>
      <div className="container">
        <form
          className="passenger__travelForm"
          onSubmit={(e) => submitHandler(e)}
        >
          <div className="form-group">
            <label>Token Id</label>
            <input
              type="text"
              value={
                ptokens.length > 0
                  ? ptokens[ptokens.length - 1]?.tokenValue
                  : ""
              }
              className="form-control"
              disabled
            />
          </div>
          <div className="form-group">
            <label>Starting Point</label>
            <select
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Vavunija">Vavunija</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Kurunagala">Kurunagala</option>
            </select>
          </div>
          <div className="form-group">
            <label>Destinating Point</label>
            <select
              type="text"
              value={endPoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="eg:-kandy"
              className="form-control"
              required
            >
              <option value="">Select</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Vavunija">Vavunija</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Kurunagala">Kurunagala</option>
            </select>
          </div>
          <div className="form-group">
            <label>Distance Traveled</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="eg:-10km"
              className="form-control"
              disabled
              required
            />
          </div>
          <div className="form-group">
            <label>Total Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="eg:-Rs7500"
              className="form-control"
              required
              disabled
            />
          </div>

          <button type="submit" className="btn btn-dark">
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerTransport;
