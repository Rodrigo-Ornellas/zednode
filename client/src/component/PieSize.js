import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';  // Doughnut
import axios from 'axios';

class PieSize extends Component {

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
            this.getDashSize();
      }

      // test = () => {
      //       console.log("PieSize: ", this.state);
      // }

      getDashSize = () => {
            axios.get(`/pie/${this.state.vessel}`)
                  .then((response) => {
                        const recievedata = JSON.parse(response.data);
                        // console.log("PieSize: ", this.state);
                        this.setState({ data: recievedata }, this.test);
                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('PIESize Error: Data NOT Received');
                  });
      }

      render() {
            return (
                  <>
                        <h2>Container Sizes</h2>
                        <Bar
                              data={this.state.data}
                              options={{
                                    title: {
                                          display: false,
                                          text: 'Container Sizes',
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

export default PieSize;
