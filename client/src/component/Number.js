import React, { Component } from 'react';
import axios from 'axios';

class Number extends Component {

      state = {}

      componentDidMount = () => {
            this.getData();
      }

      getData = () => {
            axios.get('/dashloc')
                  .then((response) => {
                        const recievedata = JSON.parse(response.data);
                        this.setState(recievedata)
                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('PIELocation Error: Data NOT Received');
                  });
      }

      render() {
            return (
                  <div>
                        <Pie
                              data={this.state}
                              options={{
                                    title: {
                                          display: true,
                                          text: 'Container Locations',
                                          fontSize: 20
                                    },
                                    legend: {
                                          display: true,
                                          position: 'right'
                                    }
                              }}
                        />
                  </div>
            );
      }
}

export default PieLocation;
