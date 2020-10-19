import React, { useState,useEffect }from 'react';
import './Report.css';
import Cookie from 'js-cookie';
import { useHistory } from 'react-router-dom'
import PassengersList from './PassengersList';
import FinancialReport from './FinancialReport';
import TokenReport from './TokenReport';
import TrafficReport from './TrafficReport';
const Report = () => {

    const history = useHistory();
    const [reportType, setReportType] = useState("passengers");
    const logoutManager = () => {
        Cookie.remove("authorizedManager");
        history.push("/manager")
    }


    return (
        <div className="container-fluid report">
            <div className="row">
                <div className="col-md-3">
                    <div className="report__left">
                        <button className="btn btn-danger" onClick={logoutManager}>Logout</button>
                        <button className="btn btn-light" onClick={()=>setReportType("passengers")}>Passengers Report</button>
                        <button className="btn btn-light" onClick={()=>setReportType("financial")}>Financial Report</button>
                        <button className="btn btn-light" onClick={()=>setReportType("tokens")}>Tokens Report</button>
                        <button className="btn btn-light" onClick={()=>setReportType("traffic")}>Traffic Report</button>
                    </div>
                </div>
                <div className="col-md-9">
                    {
                        reportType==='passengers' &&<PassengersList/>
                    }

                    {
                        reportType==='financial' &&<FinancialReport/>
                    }
                    {
                        reportType==='tokens' &&<TokenReport/>
                    }
                    {
                        reportType==='traffic' &&<TrafficReport/>
                    }

                </div>
            </div>
        </div>
    );
};

export default Report;