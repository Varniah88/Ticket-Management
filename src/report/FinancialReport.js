import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./FinancialReport.css";
import {
  viewPassengers,
  viewPassengerCredits,
} from "../redux/passenger/PassengerAction";
import jsPDF from "jspdf";
import "jspdf-autotable";
const FinancialReport = () => {
  const doc = new jsPDF();
  const dispatch = useDispatch();
  const { passengers } = useSelector((state) => state.view_Passengers);
  const { credits } = useSelector((state) => state.view_PassengerCredit);
  const [local, setLocal] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [tempData, setTempData] = useState([]);
  const [creditData, setCreditData] = useState([]);

  useEffect(() => {
    dispatch(viewPassengers());
    dispatch(viewPassengerCredits());
  }, []);

  useEffect(() => {
    setTempData(creditData.filter((data) => data.accountNo === accountNo));
    console.log("worked");
  }, [accountNo]);

  useEffect(() => {
    setLocal(passengers);
    setCreditData(credits);
  }, [passengers, credits]);

  const generateReport = () => {
    doc.autoTable({ html: "#mytable" });
    doc.save("FinancialReport.pdf");
  };

  return (
    <div className="financialReport">
      <h6 className="text-center text-info">Financial Report</h6>
      <button
        className="btn btn-danger btn-sm generateButton"
        onClick={generateReport}
      >
        Generate Report
      </button>
      <div className="financialReport__form">
        <form>
          <div className="form-group">
            <label>Select Account No</label>
            <select
              className="form-control"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
            >
              <option value="">Select</option>
              {local.map((data) => (
                <option key={data?.id} value={data?.accountNo}>
                  {data?.accountNo}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <div className="financialReport__table">
        <table className="table table-hover table-danger" id="mytable">
          <thead>
            <tr>
              <th>Account No</th>
              <th>Balance</th>
              <th>Credit</th>
              <th>Payment Type</th>
              <th>time</th>
            </tr>
          </thead>
          <tbody>
            {tempData.map((data) => (
              <tr key={data?.id}>
                <td>{data?.accountNo}</td>
                <td>{data?.balance}</td>
                <td>{data?.credit}</td>
                <td>{data?.paymentType}</td>
                <td>{new Date(data.time?.toDate()).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReport;
