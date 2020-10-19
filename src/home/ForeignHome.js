import React,{useState,useEffect} from 'react';
import './ForeignHome.css';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import {useDispatch } from "react-redux";
import { genToken } from '../redux/passenger/PassengerAction';
import { db } from '../firebase';

const ForeignHome = () => {
    const [foreignPassengers, setForeignPassengers] = useState([]);
    const [passNum, setPassNum] = useState("");
    const [tokenType, setTokenType] = useState("");
    const [tokenData, setTokenData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = db.collection("foreignPassengers").onSnapshot(async (snapshot) => {
            setForeignPassengers(await snapshot.docs.map((doc) => ({
                passportNo: doc.data().passportNo,
                name: doc.data().name,
                id: doc.id,
            })));        
        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        console.log("worked");
        const unsubscribe = db.collection("foreignPassengers").doc(foreignPassengers.length > 0 ? foreignPassengers[0]?.id : "0").collection("tokens").onSnapshot((snapshot) => {
            console.log("working...");
            setTokenData(snapshot.docs.map(doc => ({
                validity: (new Date(doc.data().validity?.toDate()))
            })));
                  
        }); 
        return () => {
            unsubscribe();
        }
    },[foreignPassengers])

    // console.table(foreignPassengers[0]);

    const checkValidity = async (collectionType, data, cvalue,genid,pvalue) => {
           
            if (tokenData.length > 0) {  
                if ((tokenData[tokenData.length-1].validity - cvalue) / 1000 > 0) {
                    let res = Math.abs(tokenData[tokenData.length-1].validity - cvalue) / 1000;  
                 // get total days between two dates
                 let days = Math.floor(res / 86400);
                 console.log("<br>Difference (Days): "+days);                        
                 
                 // get hours        
                 let hours = Math.floor(res / 3600) % 24;        
                 console.log("<br>Difference (Hours): "+hours);  
                 
                 // get minutes
                 let minutes = Math.floor(res / 60) % 60;
                 console.log("<br>Difference (Minutes): "+minutes);  
             
                 // get seconds
                 let seconds = res % 60;
                    console.log("<br>Difference (Seconds): " + seconds);   
                    
                    toast.warning('Token already exists', {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                                
                } else { 
                    dispatch(genToken({ tokenValue: genid, id: foreignPassengers[0].id, validity: pvalue }, "foreignPassengers"));
                    toast.success('Token generated Successfully!!', {
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
                
                    toast.success('Token generated ', {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                
                dispatch(genToken({ tokenValue: genid, id: foreignPassengers[0].id, validity: pvalue }, "foreignPassengers"));
                
            }           
                
    };
    


    const generateId = async (e) => {
        e.preventDefault();
       
        if (passNum === foreignPassengers[0].passportNo) {
            
            const genid = uuidv4();    
            let time = new Date();
            Date(time.setDate(time.getDate() + 1));
            
            let ptime = new Date();
            Date(ptime.setDate(ptime.getDate()));

            checkValidity("foreignPassengers", { id: foreignPassengers[0].id }, ptime,genid,time);
                      
            
        } else {
            toast.warning('Invalid Passport Number', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            }); 
        }
       
    }
    return (
        <div className="ForeignHome">
              <div className="ForeignHome__header">
                <Link to="/Foreignpassenger/home">
                    <h4>Foreign Passengers</h4>
                </Link>
                <Link to="/passenger/home">
                    <h4>Local Passengers</h4>
                </Link>
            </div> 

            <div className="container mt-4">   
            <ToastContainer/>    
                <form className="ForeignHome__form" onSubmit={e => generateId(e)}>
                    <div className="form-group">
                        <label>Passport Number</label>
                        <input type="number" placeholder="Enter your Passport Number" className="form-control"
                          value={passNum} onChange={e=>setPassNum(e.target.value)}  required />
                    </div>
                    <div className="form-group">
                        <label>Token Type</label>
                        <select className="form-control" value={tokenType} onChange={e=>setTokenType(e.target.value)} required>
                            <option value="">Select</option>
                            <option value="smartCard">Smart Card</option>
                            <option value="ticket">Ticket</option>
                            <option value="digital">Digital Ticket</option>
                        </select>
                    </div>
                    <button className="btn btn-dark" type="submit">Get Token For Foreign Passenger</button>
                </form>
            </div>
        </div>
    );
};

export default ForeignHome;