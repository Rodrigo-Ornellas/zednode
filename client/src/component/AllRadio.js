import React, { useState, useEffect } from 'react'
import RadioItem from './RadioItem'

function AllRadio(props) {

      // console.log('ALLRADIO', props)
      // const trips = [ "ADRM12", "ANAM002" ];
      const [ trips, setTrips ] = useState([ props.vessel ]);

      useEffect(() => {
            fetch("/schetest")
                  .then(res => res.json())
                  .then(
                        (result) => {
                              // console.log("RESULT", result[ 0 ].trip);

                              // setTrips(Object.values(JSON.parse(result)));
                              setTrips(Object.values(result));
                              // console.log("NEW TRIP ARRAY", trips);
                        },
                        // Note: it's important to handle errors here
                        // instead of a catch() block so that we don't swallow
                        // exceptions from actual bugs in components.
                        (error) => {
                              console.log(error);
                        }
                  )
      }, [])

      return (
            <div className="tripSelector">
                  <p>Please select your Vessel/Trip:</p>
                  <div className="selectGroup">
                        {trips.map((item, index) => {
                              // console.log("NEW TRIP ARRAY", trips);
                              return <RadioItem key={index} item={item} />
                        })}
                  </div>
            </div>
      );
}

export default AllRadio;
