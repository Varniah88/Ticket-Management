import React,{useEffect,useState} from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { viewPassengers,addPassengerRequest} from '../redux/passenger/PassengerAction';
import {useHistory} from 'react-router-dom'
const Navbar = () => {
    const { isAuth } = useSelector(state => state.add_passengerAuth);
    const history = useHistory();
    const authorizedUser = Cookie.getJSON("authorizedUser") || [];
    const dispatch = useDispatch();
    
    const logoutUser = () => {
        Cookie.remove("authorizedUser");
        history.push("/");
        dispatch(addPassengerRequest(false));
    }
    return (
        <div className="navbar">
            <div className="navbar_leftItems">
                <Link to="/">
                    <img src="https://firebasestorage.googleapis.com/v0/b/fir-store-react.appspot.com/o/images%2Fpngegg.png?alt=media&token=cd539c6d-b81d-4d3d-8656-3e41ad80e404" loading="lazy"
                        alt="logo"
                        className="navbar__logo"
                    />
                </Link>
                <Link to="/">
                    <h6>Srilanka public Transport</h6>
                </Link>
            </div>
            <div className="navbar__RightItems">
                <Link to="/passenger/home">
                    <h6>Home</h6>
                </Link>
                <Link to="/passenger/transport">
                    <h6>Travel</h6>
                </Link>
                <Link to="/report/home">
                    <h6>Report</h6>
                </Link>
                {
                    isAuth  &&
                    <button className="btn btn-danger" onClick={logoutUser}>
                        Logout
                    </button>           
                }
             </div>
        </div>
    );
};

export default Navbar;