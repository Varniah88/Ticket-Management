import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  viewPassengers,
  getToken,
  getTravels,
} from "../redux/passenger/PassengerAction";
import "./TrafficReport";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TrafficReport = () => {
  const doc = new jsPDF();
  const dispatch = useDispatch();
  const { passengers } = useSelector((state) => state.view_Passengers);
  const { tokens } = useSelector((state) => state.view_Tokens);
  const { travels } = useSelector((state) => state.view_Travels);
  const [accountNo, setAccountNo] = useState("");
  const [passengerData, setPassengerData] = useState([]);
  const [tokenData, setTokenData] = useState([]);
  const [selectToken, setSelectToken] = useState("");
  const [travelData, setTravelData] = useState([]);

  useEffect(() => {
    dispatch(viewPassengers());
  }, []);
  useEffect(() => {
    setTravelData(travels);
  }, [travels]);

  useEffect(() => {
    setPassengerData(passengers);
    setTokenData(tokens);
  }, [passengers, tokens]);

  useEffect(() => {
    dispatch(getToken("localPassengers", accountNo));
  }, [accountNo]);

  useEffect(() => {
    dispatch(getTravels(accountNo, "localPassengers", selectToken));
  }, [selectToken]);

  const generateReport = () => {
    doc.autoTable({ html: "#mytable" });
    doc.save("TrafficReport.pdf");
  };

  return (
    <div className="trafficReport">
      <h6 className="text-center text-info">Token Report</h6>
      <button
        className="btn btn-danger btn-sm generateButton"
        onClick={generateReport}
      >
        Generate Report
      </button>
      <div className="token__form">
        <form>
          <div className="form-group">
            <label>Select Account No</label>
            <select
              className="form-control"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
            >
              <option value="">Select</option>
              {passengerData.map((data) => (
                <option key={data?.id} value={data?.id}>
                  {data?.accountNo}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select TokenV</label>
            <select
              className="form-control"
              value={selectToken}
              onChange={(e) => setSelectToken(e.target.value)}
            >
              <option value="">Select</option>
              {tokenData.map((data) => (
                <option key={data?.id} value={data?.id}>
                  {data?.tokenValue}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <div className="trafficReport__table">
        <table className="table table-hover table-danger" id="mytable">
          <thead>
            <tr>
              <th>Balance</th>
              <th>Distance</th>
              <th>startPoint</th>
              <th>Endpoint</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {travelData.map((data) => (
              <tr key={data?.id}>
                <td>{data?.balance}</td>
                <td>{data?.distance}</td>
                <td>{data?.startPoint}</td>
                <td>{data?.endPoint}</td>
                <td>{data?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrafficReport;
