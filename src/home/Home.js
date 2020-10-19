import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  viewPassengers,
  addCredit,
  genToken,
  getToken,
} from "../redux/passenger/PassengerAction";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "./Home.css";
import Cookie from "js-cookie";
import { db } from "../firebase";

const Home = () => {
  const authorizedUser = Cookie.getJSON("authorizedUser") || [];
  const dispatch = useDispatch();
  const { passengers } = useSelector((state) => state.view_Passengers);
  const { tokens } = useSelector((state) => state.view_Tokens);
  const curentPassenger = passengers.filter(
    (data) => data.accountNo === authorizedUser[0].accountNo
  );
  console.log("curentPassenger", curentPassenger[0]);
  const [authUser, setAuthUser] = useState("");
  const [ptokens, setTokens] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [balance, setBalance] = useState("");
  const [credit, setCredit] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [tokenType, setTokenType] = useState("");
  const [tokenData, setTokenData] = useState([]);
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    dispatch(viewPassengers());
  }, []);

  useEffect(() => {
    console.log("tokens", tokens);
    setTokens(tokens);
  }, [tokens]);

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
    setBalance(curentPassenger[0]?.balance);
  }, [curentPassenger[0]?.balance]);

  useEffect(() => {
    console.log(authorizedUser);
    setAuthUser(authorizedUser);
    setAccountNo(authorizedUser[0].accountNo);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const tempData = {
      accountNo: accountNo,
      balance: balance,
      credit: credit,
      paymentType: paymentType,
    };
    dispatch(addCredit(tempData, authorizedUser[0].id));
    setBalance("");
    setCredit("");
  };
  const generateId = (e) => {
    e.preventDefault();
    const genid = uuidv4();
    let time = new Date();
    Date(time.setDate(time.getDate() + 1));

    let ptime = new Date();
    Date(ptime.setDate(ptime.getDate()));

    checkValidity(
      "localPassengers",
      { id: curentPassenger[0].id },
      ptime,
      genid,
      time
    );
  };

  const checkValidity = async (collectionType, data, cvalue, genid, pvalue) => {
    if (tokenData.length > 0) {
      if ((tokenData[tokenData.length - 1].validity - cvalue) / 1000 > 0) {
        let res =
          Math.abs(tokenData[tokenData.length - 1].validity - cvalue) / 1000;
        // get total days between two dates
        let days = Math.floor(res / 86400);
        console.log("<br>Difference (Days): " + days);

        // get hours
        let hours = Math.floor(res / 3600) % 24;
        console.log("<br>Difference (Hours): " + hours);

        // get minutes
        let minutes = Math.floor(res / 60) % 60;
        console.log("<br>Difference (Minutes): " + minutes);

        // get seconds
        let seconds = res % 60;
        console.log("<br>Difference (Seconds): " + seconds);
        toast.warning("Token already exists", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      } else {
        dispatch(
          genToken(
            { tokenValue: genid, id: curentPassenger[0].id, validity: pvalue },
            collectionType
          )
        );
        toast.success("Token generated Successfully!!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.success("Token generated ", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      dispatch(
        genToken(
          { tokenValue: genid, id: curentPassenger[0].id, validity: pvalue },
          collectionType
        )
      );
    }
  };

  return (
    <div className="home">
      <ToastContainer />
      <div className="home__header">
        <Link to="/Foreignpassenger/home">
          <h4>Foreign Passengers</h4>
        </Link>
        <Link to="/passenger/home">
          <h4>Local Passengers</h4>
        </Link>
      </div>
      <div className="container mt-4">
        <form className="home__form" onSubmit={(e) => generateId(e)}>
          <div className="form-group">
            <label>Token Type</label>
            <select
              className="form-control"
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="smartCard">Smart Card</option>
              <option value="ticket">Ticket</option>
              <option value="digital">Digital Ticket</option>
            </select>
          </div>
          <button className="btn btn-dark" type="submit">
            Get Token
          </button>
        </form>
        <h6 className="text-center text-primary mt-4">
          Current Token:
          {ptokens.length > 0 ? ptokens[ptokens.length - 1]?.tokenValue : ""}
        </h6>
        <h6 className="text-center text-info">
          Token Validity : {timer?.hours} hrs {timer?.minutes} min{" "}
          {Math.floor(timer?.seconds)} sec
        </h6>
      </div>
      <div className="home__bottom">
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="form-group">
            <label>Account No</label>
            <input
              type="text"
              value={accountNo}
              className="form-control"
              disabled
            />
          </div>
          <div className="form-group">
            <label>Current Balance</label>
            <input
              type="text"
              value={balance}
              className="form-control"
              disabled
            />
          </div>
          <div className="form-group">
            <label>Add credit</label>
            <input
              type="text"
              placeholder="Enter Amount to add"
              onChange={(e) => setCredit(e.target.value)}
              className="form-control"
              value={credit}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              className="form-control"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              required
            >
              <option value="">select</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="mobile">Mobile</option>
              <option value="credit">Credit/Debit</option>
            </select>
          </div>
          <button className="btn btn-info" type="submit">
            Add Credit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
