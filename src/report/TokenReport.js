import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewPassengers, getToken } from "../redux/passenger/PassengerAction";
import "./TokenReport.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
const TokenReport = () => {
  const doc = new jsPDF();
  const dispatch = useDispatch();
  const { passengers } = useSelector((state) => state.view_Passengers);
  const { tokens } = useSelector((state) => state.view_Tokens);
  const [accountNo, setAccountNo] = useState("");
  const [passengerData, setPassengerData] = useState([]);
  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    dispatch(viewPassengers());
  }, []);

  useEffect(() => {
    setPassengerData(passengers);
    setTokenData(tokens);
  }, [passengers, tokens]);

  useEffect(() => {
    dispatch(getToken("localPassengers", accountNo));
  }, [accountNo]);

  const generateReport = () => {
    doc.autoTable({ html: "#mytable" });
    doc.save("TokenReport.pdf");
  };

  return (
    <div className="tokenReport">
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
        </form>
      </div>
      <div className="tokenReport__table">
        <table className="table table-hover table-danger" id="mytable">
          <thead>
            <tr>
              <th>token Value</th>
              <th>Validity</th>
              <th>Token Created</th>
            </tr>
          </thead>
          <tbody>
            {tokenData.map((data) => (
              <tr key={data?.id}>
                <td>{data?.tokenValue}</td>
                <td>{new Date(data.validity?.toDate()).toUTCString()}</td>
                <td>{new Date(data.time?.toDate()).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenReport;
