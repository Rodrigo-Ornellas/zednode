import React, { Component } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
// import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


class TripList extends Component {

      state = {
            allBookings: []
      }

      componentDidMount = () => {
            this.getBookings();
      }

      getBookings = () => {
            axios.get('/bookings')
                  .then((response) => {
                        const data = response.data;
                        // console.log(data);
                        this.setState({ allBookings: data })
                  })
                  .catch(() => {
                        console.log('Error: sData NOT Received');
                  });
      }


      render() {
            return (
                  <TableContainer component={Paper}>
                        {/* <Table className={classes.table} aria-label="simple table"></Table> */}
                        <Table aria-label="simple table">
                              <TableHead>
                                    <TableRow>
                                          <TableCell>Container</TableCell>
                                          <TableCell align="right">Size</TableCell>
                                          <TableCell align="right">Location</TableCell>
                                          <TableCell align="right">Booking</TableCell>
                                          <TableCell align="right">In&nbsp;Time</TableCell>
                                          <TableCell align="right">Vessel</TableCell>
                                    </TableRow>
                              </TableHead>
                              <TableBody>
                                    {this.state.allBookings.map((row, index) => (
                                          <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                      {row.container}
                                                </TableCell>
                                                <TableCell align="right">{row.size}</TableCell>
                                                <TableCell align="right">{row.location}</TableCell>
                                                <TableCell align="right">{row.booking}</TableCell>
                                                <TableCell align="right">{row.intime}</TableCell>
                                                <TableCell align="right">{row.trip}</TableCell>
                                          </TableRow>
                                    ))}
                              </TableBody>
                        </Table>
                  </TableContainer>
            );
      }
};

export default TripList;
