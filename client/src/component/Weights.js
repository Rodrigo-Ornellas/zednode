import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { format } from 'mysql';


function Weights(props) {

      const [ data, setData ] = useState([]);
      // state = {
      // vessel: "ANAM002"
      // vessel: "ANAM001"
      // vessel: "ADRM12"
      // }

      useEffect(() => {
            axios.get(`/weights/${props.vessel}`)
                  .then((response) => {
                        // console.log('RAW DATA: ', response.data);
                        // const recievedata = JSON.parse(response.data);
                        const recievedata = response.data;
                        setData(recievedata);
                        // console.log('Weights STATE: ', data)
                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('Weights Error: Data NOT Received');
                  });
      }, [ props.vessel ])

      // var nf = new Intl.NumberFormat();
      // nf.format(number); // "1,234,567,890"

      return (
            <>
                  <h2>Vessel Weights</h2>
                  <div className="wvalues">
                        <div className="leftSide">
                              <i className="fas fa-star-half-alt"></i>
                              <div className="rightSide">
                                    Gross WT
                              <span>{data.gross ? parseInt(data.gross).toLocaleString('en') : "0"}</span>
                              </div>
                        </div>
                        <div className="leftSide">

                              <i className="far fa-star"></i>
                              <div className="rightSide">
                                    Tarre WT
                        <span>{data.tare ? parseInt(data.tare).toLocaleString('en') : "0"}</span>
                              </div>
                        </div>
                        <div className="leftSide">
                              <i className="fas fa-star"></i>
                              <div className="rightSide">
                                    Total WT
                              <span>{data.total ? parseInt(data.total).toLocaleString('en') : "0"}</span>
                              </div>
                        </div>
                  </div>
            </>
      );


}

export default Weights;