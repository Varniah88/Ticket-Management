import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./PassengerList.css";
import {
  viewForeignPassengers,
  viewPassengers,
} from "../redux/passenger/PassengerAction";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PassengersList = () => {
  const doc = new jsPDF();
  const dispatch = useDispatch();
  const { passengers } = useSelector((state) => state.view_Passengers);
  const { foreign_passengers } = useSelector(
    (state) => state.view_ForeignPassengers
  );
  const [local, setLocal] = useState([]);
  const [foreign, setForeign] = useState([]);
  doc.autoTable({ html: "#mytable" });

  useEffect(() => {
    dispatch(viewPassengers());
    dispatch(viewForeignPassengers());
  }, []);

  useEffect(() => {
    setForeign(foreign_passengers);
    setLocal(passengers);
  }, [passengers, foreign_passengers]);

  const generateReport = () => {
    doc.save("PassengerReport.pdf");
  };

  return (
    <div className="passengersList">
      <h6 className="text-center text-info">Passengers Report</h6>

      <div className="passengerListCoontainer">
        <div className="passengerList__left">
          <h6 className="text-danger">
            Local Passengers List
            <button
              className="btn btn-danger btn-sm generateButton"
              onClick={generateReport}
            >
              Generate Report
            </button>
          </h6>
          <table className="table table-info table-hover" id="mytable">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>balance</th>
              </tr>
            </thead>
            <tbody>
              {local.map((data) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="passengerList__right">
          <h6 className="text-danger">Foreign Passengers List </h6>

          <table className="table table-info table-hover" id="mytable1">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>passportNo</th>
              </tr>
            </thead>
            <tbody>
              {foreign.map((data) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.passportNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PassengersList;
