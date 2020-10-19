import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
const ManagerProtected = ({component,...rest}) => {
    let RenderComponent=component;
    console.log(Component);
    let authorizedManager = Cookie.get("authorizedManager") || false;
    console.log("userToken",authorizedManager);
    return (
      <Route
        {...rest}
        render={
            props=>{
                console.log("Component",props);
                return authorizedManager?(<RenderComponent {...rest} {...props}/>):(  <Redirect
                    to={{
                        pathname:'/manager'
                    }}
                    />)
            }
        }     
      />
    );
};


export default ManagerProtected;

