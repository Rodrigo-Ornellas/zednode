import React, { Component } from 'react';
import TripList from './TripList';
import { Grid } from '@material-ui/core';
import Header from './Header';
import PieSize from './PieSize';
import PieLocation from './PieLocation';
import AllRadio from './AllRadio';
import Weights from './Weights';
import axios from 'axios';

import './PageContainers.css';
import BookCount from './BookCount';

class PageContainers extends Component {

      state = {
            vessel: "ANAM002"
            // vessel: "ANAM001"
            // vessel: "ADRM12"
      }

      componentDidMount = () => {
            this.getData();
      }

      getData = () => {
            axios.get(`/schetest`)
                  .then((response) => {
                        const recievedata = response.data;
                        // console.log('PageContaner STATE BEFORE: ', this.state);
                        this.setState({ trips: recievedata });
                        // console.log('PageContaner STATE AFTER: ', this.state);
                  })
                  .catch((err) => {
                        console.log(err);
                        console.log('PIELocation Error: Data NOT Received');
                  });
      }

      render() {

            return (
                  <Grid container direction="column" >


                        {/* ============================= HEADER ============================== */}
                        <Grid item>
                              <Header />
                        </Grid>

                        <Grid container direction="column" id="mainContainer">
                              {/* ============================= VESSEL PICKER ============================== */}
                              <Grid item container >
                                    {/* <GetVessels /> */}
                                    <AllRadio vessel={this.state.vessel} />
                              </Grid>

                              {/* ============================= WEIGHT of the VESSEL  ============================== */}
                              <Grid item container className="weightNum" style={{ padding: 40 }}>

                                    <Weights vessel={this.state.vessel} />

                              </Grid>

                              {/* ============================= PIE & BAR ============================== */}
                              <Grid item container style={{ padding: 40 }}>

                                    <Grid item container className="piegraphs">
                                          <Grid item xs={12} sm={5}>
                                                <PieSize vessel={this.state.vessel} />
                                          </Grid>
                                          <Grid item xs={12} sm={5}>
                                                <PieLocation vessel={this.state.vessel} />
                                          </Grid>
                                    </Grid>


                              </Grid>
                              {/* ============================= BOOKING COUNT & TOTAL ============================== */}
                              <Grid item container style={{ padding: 40 }}>

                                    <Grid item container>
                                          <Grid item xs={12} sm={12}>
                                                <BookCount vessel={this.state.vessel} />
                                          </Grid>
                                          {/* <Grid item xs={12} sm={5}>
                                                <PieLocation vessel={this.state.vessel} />
                                          </Grid> */}
                                    </Grid>


                              </Grid>


                              {/* ============================= TABLE ============================== */}
                              <Grid item container style={{ padding: 40 }}>

                                    <TripList />

                              </Grid>

                        </Grid>
                  </Grid>
            );
      }

}

export default PageContainers;
