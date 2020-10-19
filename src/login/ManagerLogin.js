import React,{useState,useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { viewPassengers,addPassengerRequest} from '../redux/passenger/PassengerAction';
import './ManagerLogin.css';
import { toast, ToastContainer } from 'react-toastify';
import Cookie from 'js-cookie';
import {useHistory,Redirect} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
const ManagerLogin = () => {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const [username, setUserName] = useState("");
    
    const submitHandler = (e) => {
        e.preventDefault(); 
        if (username === "admin") {  
            Cookie.set("authorizedManager",true);
            toast.success('Sucessfully login', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            history.push("/report/home");
           
        } else {
            toast.error('Invalid login', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
        }
        setUserName("");     
    }
    
    return (

        <div className="login">    
              
            <div className="container mt-4">
             
                <div className="login__form">
                    <form id="frm" onSubmit={(e)=>submitHandler(e)}>
                        <div className="form-group">
                            <label>Manager userName</label>
                            <input type="text" className="form-control" value={username} onChange={e=>setUserName(e.target.value)}
                                placeholder="Enter username" required />
                        </div>
                        <ToastContainer/>
                        <button className="btn btn-info" type="submit" >Login as Manager</button>
                     
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManagerLogin;

