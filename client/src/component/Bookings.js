import React, { useState } from 'react'

function Bookings(props) {
      // console.log('PROPSSSS', props.data);

      const [ data ] = useState(props.data);
      // const [ example, setExample ] = useState({ 'ZIMUTRT0105488': 7 });
      // const [ vessel, setVessel ] = useState('ANAM002');

      return (
            <>
                  <div className="booking">
                        {/* <a className="booking" href=`/bookcount/${this.state.vessel}`> */}
                        <div className="bnum">{Object.keys(data)[ 0 ]}</div>
                        <div className="bcount">{Object.values(data)[ 0 ]} </div>
                  </div>
            </>
      )
}

export default Bookings;