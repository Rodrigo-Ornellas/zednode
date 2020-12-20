import React from 'react'

const RadioItem = (props) => {
      const { item } = props;

      return (

            <div className="selectVessel" >
                  {/* { console.log("RADIOITEM: ", props)} */}
                  <h3>{item.trip}</h3>

                  <div className="radioDate"><i className="fas fa-plane-arrival"></i> {typeof item.erd_date !== "undefined" ? cleanDate(item.erd_date) : ""}</div>
                  <div className="radioDate"><i className="fas fa-plane-departure"></i> {typeof item.etd_date !== "undefined" ? cleanDate(item.etd_date) : ""}</div>
                  <input key={item.trip} type="radio" id={item.trip} name="ship" />
                  {/* <label htmlFor={item.trip}>{item.trip}</label> */}

            </div>
      )
}

export default RadioItem;

function cleanDate(strg) {

      let result = strg.split('T')[ 0 ];
      let d = new Date(result);
      result = d.toLocaleString('en-US', {
            weekday: 'short', // "Sat"
            month: 'short', // "June"
            day: '2-digit' // "01"
      });

      return result;
}
