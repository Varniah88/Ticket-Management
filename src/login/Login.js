import React,{useState,useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { viewPassengers,addPassengerRequest} from '../redux/passenger/PassengerAction';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import Cookie from 'js-cookie';
import {useHistory,Redirect} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const authorizedUser = Cookie.getJSON("authorizedUser") || [];
    const history = useHistory();
    const dispatch = useDispatch();
    const [number, setNumber] = useState("");
    const { passengers } = useSelector(state => state.view_Passengers);
    useEffect(() => {
        dispatch(viewPassengers());
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        const foundData = passengers.filter(data => data.accountNo === number);
        setNumber("");
        if (foundData.length > 0) {
            Cookie.set("authorizedUser", JSON.stringify(foundData));
            toast.success('Sucessfully login', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            history.push("/passenger/home");
            dispatch(addPassengerRequest(true));
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

        
       
    }
    
    return (

        <div className="login">    
            {
                authorizedUser.length===0?(null):(
                    <Redirect
                    to={{
                        pathname:'/passenger/home'
                    }}
                    />
                )
            }    
            <div className="container mt-4">
             
                <div className="login__form">
                    <form id="frm" onSubmit={(e)=>submitHandler(e)}>
                        <div className="form-group">
                            <label>Account Number</label>
                            <input type="text" className="form-control" value={number} onChange={e=>setNumber(e.target.value)}
                                placeholder="Enter Your Account No" required />
                        </div>
                        <ToastContainer/>
                        <button className="btn btn-info" type="submit" >Login</button>
                        
                        <button className="btn btn-info" type="button" onClick={()=>history.push("/Foreignpassenger/home")}>Login as foreigner</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;