import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
const UserProtected = ({component,...rest}) => {
    let RenderComponent=component;
    console.log(Component);
    let authorizedUser = Cookie.getJSON("authorizedUser") || [];
    console.log("userToken",authorizedUser);
    return (
      <Route
        {...rest}
        render={
            props=>{
                console.log("Component",props);
                return authorizedUser.length > 0 ?(<RenderComponent {...rest} {...props}/>):(  <Redirect
                    to={{
                        pathname:'/'
                    }}
                  />)
            }
        }          
      />
    );
};


export default UserProtected;