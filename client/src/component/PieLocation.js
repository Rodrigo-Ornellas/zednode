import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

class PieLocation extends Component {

      constructor(props) {

            super(props)

            this.state = {
                  vessel: props.vessel || "null",
                  data: {
                        datasets: Array(0),
                        labels: Array(0)
                  }

            }
      }


      componentDidMount = () => {
            this.getData();
      }

      // test = () => {
      //       console.log('PieLocation: ', this.state)
      // }

      getData = () => {
            axios.get(`/locpie/${this.state.vessel}`)
                  .then((response) => {
                        const recievedata = JSON.parse(response.data);
                        // console.log('PieLocation: ', this.state)
                        this.setState({ data: recievedata }, this.test);
                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('PIELocation Error: Data NOT Received');
                  });
      }

      render() {
            return (
                  <>
                        <h2>Container Locations</h2>
                        <Pie
                              data={this.state.data}
                              options={{
                                    title: {
                                          displsay: false,
                                          text: 'Container Locations',
                                          fontSize: 20
                                    },
                                    legend: {
                                          display: false,
                                          position: 'right'
                                    }
                              }}
                        />
                  </>
            );
      }
}

export default PieLocation;
