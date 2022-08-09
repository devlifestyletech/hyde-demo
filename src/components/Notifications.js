import React ,{useState,useEffect} from "react"
import { fcmWeb } from '../utils/firebaseConfig'

const Notifications =(props) =>{
    const [isTokenFound, setTokenFound] =useState(false);
    console.log("Token found" ,isTokenFound)
    // To load once
    useEffect(() =>{
        let data;
        async function tokenFunc(){
            data = await fcmWeb(setTokenFound);
            if(data){
                console.log("Token is", data);
            }
            return data;
        }
        tokenFunc();

    },[setTokenFound]);
    return <></>;
};
Notifications.prototype={};

export default Notifications