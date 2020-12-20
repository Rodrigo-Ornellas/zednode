import React, { Component } from 'react';
// import { HorizontalBar } from 'react-chartjs-2';
import axios from 'axios';
import Bookings from './Bookings'

class BookCount extends Component {

      constructor(props) {

            super(props)

            this.state = {
                  vessel: props.vessel || "null",
                  arr: [],
                  bookings: 0,
                  containers: 0
            }
      }

      componentDidMount = () => {
            this.getData();
      }

      parseBookings = () => {
            // console.log("BOOKING STATE: ", this.state.data);
            let tmpdata = this.state.data;
            const tmp = tmpdata.map(x => JSON.parse(x))
            // console.log('ARRAY: ', tmp);
            // this.setState({ arr: Object.values(tmp) });
            this.setState({ arr: tmp });
            // console.log(arrValues);

      }

      getData = () => {
            axios.get(`/bookcount/${this.state.vessel}`)
                  .then((response) => {
                        const recievedata = JSON.parse(response.data[ 0 ]);
                        console.log("BookCount FRONT: ", recievedata);
                        this.setState({ data: recievedata }, this.parseBookings);
                        this.setState({ bookings: response.data[ 1 ] });
                        this.setState({ containers: response.data[ 2 ] });

                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('BookCount Error: Data NOT Received');
                  });
      }

      render() {

            return (
                  <>
                        <h2>Booking / Container Count</h2>
                        <p>Bookings with more than 1 container inside. All other bookings have only one container inside.</p>
                        <div className="bsummary">
                              <div>Bookings <span>{this.state.bookings}</span></div>
                              <div>Containers <span>{this.state.containers}</span></div>
                        </div>
                        <div className="bgroup">
                              {this.state.arr.map((e, index) => {
                                    // console.log('each booking: ', e);

                                    if (Object.values(e)[ 0 ] !== 1) {
                                          return <Bookings key={index} data={e} />
                                    }

                                    return '';
                              })}
                        </div>
                  </>
            );
      }
}

export default BookCount;
