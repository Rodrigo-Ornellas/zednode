import React, { Component } from 'react';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

class GetVessels extends Component {

      state = {
            vessels: [],
            value: "ANAM0002"
      }


      componentDidMount = () => {
            this.getVessels();
      }

      handleChange = (event) => {
            // this.setState({
            //       selection: event.target.value
            // })
            this.value.setValues(event.target.value);
      }

      getVessels = () => {
            axios.get('/schedule')
                  .then((response) => {
                        const data = response.data;

                        //console.log(typeof this.state.vessels)
                        data.map(vessel => {

                              return (
                                    this.state.vessels.push(vessel.trip)
                              )
                        });
                        // console.log('VESSELS 2: ', this.state.vessels);
                  })
                  .catch(() => {
                        console.log('VESSELS Error: sData NOT Received');
                  });
      }

      render() {

            return (
                  <div>
                        <FormControl component="fieldset" >

                              <RadioGroup aria-label="vessel" name="vessels" value={this.state.value} onChange={this.handleChange}>
                                    {this.state.vessels.map((ship, index) => {
                                          return (
                                                <FormControlLabel
                                                      key={index}
                                                      value={ship}
                                                      control={< Radio />}
                                                      label={ship} />
                                          )
                                    })}
                              </RadioGroup>
                        </FormControl>
                  </div>
            )
      }
}

export default GetVessels;