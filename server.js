// import Scheduler from './server/models/Scheduler';
// *******************************************************
// ******** NPMs Installed *******************************
// *******************************************************
//
//      1)  express
//      2)  mysql
//      3)  cors
//
// *******************************************************
// ******** Required Modules *****************************
// *******************************************************
const cors = require('cors');
const mysql = require('mysql');
const express = require('express');
const morgan = require('morgan');

// *******************************************************
// ******** Environmental Variables **********************
// *******************************************************
const port = process.env.PORT || 3099;
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// connection string
const conStr = {
      host: 'localhost',
      database: 'zednode',
      user: 'root',
      password: 'root',
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};


// *******************************************************
// ******** Query Setup **********************************
// *******************************************************
const con = mysql.createConnection(conStr);


// *******************************************************
// ******** GETs - the "R" in CRUD **********************
// *******************************************************

app.get('/bookings', function (request, response) {
      let qry = `SELECT * FROM upload_zed;`;
      //let qry = `SELECT * FROM upload_zed order by id desc limit 10;`;
      let bookings = [];
      con.query(qry, (err, res) => {
            if (err) throw err;

            let temp = {};
            for (let i = 0; i < res.length; i++) {
                  //console.log(`Response ${i}: ${response[ i ]}`)
                  temp = {
                        container: `${res[ i ].container}`,
                        size: `${res[ i ].size}`,
                        location: `${res[ i ].location}`,
                        pod: `${res[ i ].pod}`,
                        position: `${res[ i ].position}`,
                        booking: `${res[ i ].booking}`,
                        trip: `${res[ i ].trip}`,
                        wtgross: `${res[ i ].wtgross}`,
                        tarewt: `${res[ i ].tarewt}`,
                        intime: `${res[ i ].intime}`
                  }
                  bookings.push(temp);

            }
            bookings = JSON.stringify(bookings);
            // console.log('trip: ', bookings);
            response.send(bookings);
      })
})

// *******************************************************
// TESTING for CLASS IMPLEMENTATION
// *******************************************************

app.get('/schetest', function (request, response) {

      [ past, future ] = dateRange();
      // use the PAST and FUTURE dates to build the SQL query
      let qry = `SELECT trip, erd_date, etd_date FROM trip WHERE erd_date BETWEEN CAST('${past}' AS DATE) AND CAST('${future}' AS DATE)`;

      con.query(qry, (err, res) => {
            if (err) throw err;

            // let vessels = [];
            // res.map(vessel => {
            //       vessels.push(vessel.trip);
            // })
            response.send(JSON.stringify(res));

      })
});

// *******************************************************
// GET SCHEDULE OF VESSELS
// *******************************************************

app.get('/schedule', function (request, response) {

      // use the PAST and FUTURE dates to build the SQL query
      //let qry = `SELECT trip FROM trip WHERE erd_date BETWEEN CAST('${past}' AS DATE) AND CAST('${future}' AS DATE)`;
      let qry = `SELECT trip FROM trip`;

      con.query(qry, (err, res) => {
            if (err) throw err;

            // let vessels = [];
            // res.map(vessel => {
            //       vessels.push(vessel.trip);
            // })
            response.send(res);

      })
});

// *******************************************************
// CALCULATE VGM - Container WEIGHTS
// *******************************************************

app.get('/weights/:vessel', async function (request, response) {


      let result = {
            'gross': 0,
            'tare': 0,
            'total': 0
      };

      let gross = 0;
      let tare = 0;
      let shiptrip = splitVessel(request.params.vessel);

      // fetch GROSS WEIGHT
      let qry = `SELECT SUM(wtgross) AS gross FROM upload_zed WHERE trip="${shiptrip}"`;
      await con.query(qry, (err, res) => {
            if (err) throw err;

            gross = parseFloat(res[ 0 ].gross);
            result.gross = gross.toString();

      })

      // fetch TARE WEIGHT
      qry = `SELECT SUM(tarewt) AS tare FROM upload_zed WHERE trip="${shiptrip}"`;

      await con.query(qry, (err, res) => {
            if (err) throw err;

            tare = parseFloat(res[ 0 ].tare);
            result.tare = tare.toString();

            let total = gross + tare;
            result.total = total.toString();

            console.log('WEIGHTS: ', result);
            response.send(JSON.stringify(result));

      })

});

// *******************************************************
// QUANTITY of CONTAINERS per BOOKINGS
//
// this ENDPOINT fetchs the data 
// *******************************************************

app.get('/bookcount/:vessel', function (request, response) {

      let shiptrip = splitVessel(request.params.vessel);
      let qry = `SELECT booking, COUNT(*) as count FROM upload_zed WHERE trip = "${shiptrip}" GROUP BY booking;`;


      con.query(qry, (err, res) => {
            if (err) throw err;
            let labels = [];
            let data = [];
            let result = [];

            let totalContainers = 0;

            for (let i = 0; i < res.length; i++) {
                  labels.push(res[ i ].booking);
                  data.push(res[ i ].count);
                  totalContainers += res[ i ].count;
            }

            // quantity of Bookings
            let totalBookings = labels.length;

            // ordering the array from largest to smallest count of containers
            [ data, labels ] = orderArray(data, labels)

            // generate an object to be returned
            // object has booking number : count
            for (let j = 0; j < data.length; j++) {
                  result.push(`{ "${labels[ j ]}" : ${data[ j ]} }`);
            }

            console.log(`bookcount: ${result}`);
            response.send([ JSON.stringify(result), totalBookings, totalContainers ]);
      })
});

// *******************************************************
// TOTAL NUMBER OF BOOKINGS and CONTAINERS
//
// this ENDPOINT fetchs the data 
// *******************************************************

app.get('/booktotal/:vessel', function (request, response) {

      let shiptrip = splitVessel(request.params.vessel);
      let qry = `SELECT booking, COUNT(*) as booktotal FROM upload_zed WHERE trip = "${shiptrip}" GROUP BY location;`;

      con.query(qry, (err, res) => {
            if (err) throw err;

            console.log(`booktotal: ${res}`);
            response.send(res);
      })
});



// *******************************************************
// QUANTITY per SIZE of the CONTAINERS
//
// this ENDPOINT fetchs the data 
// *******************************************************

// app.get('/p/:tagId', function(req, res) {
//       res.send("tagId is set to " + req.params.tagId);
//     });


app.get('/pie/:vessel', function (request, response) {


      let shiptrip = splitVessel(request.params.vessel);
      let qry = `SELECT size, COUNT(*) as count FROM upload_zed WHERE trip = "${shiptrip}" GROUP BY size;`;
      let dashsize = [];

      con.query(qry, (err, res) => {
            if (err) throw err;
            let labels = [];
            let data = [];

            for (let i = 0; i < res.length; i++) {
                  labels.push(`${res[ i ].size}`);
                  data.push(`${res[ i ].count}`);
            }

            [ data, labels ] = orderArray(data, labels)

            let temp = {
                  labels: labels,
                  datasets: [ {
                        label: 'Container Sizes',
                        backgroundColor: [
                              '#713D99',
                              '#FFCA40',
                              '#7C14CC',
                              '#CC8714',
                              '#0400FF',

                        ],
                        hoverBackgroundColor: [
                              '#713D9980',
                              '#FFCA4080',
                              '#7C14CC80',
                              '#CC871480',
                              '#0400FF80',

                        ],
                        data: data
                  } ]
            };
            dashsize.push(JSON.stringify(temp));
            // console.log(`DashSize: ${dashsize}`);
            response.send(dashsize);
      })
});

// *******************************************************
// QUANTITY per LOCATION of the CONTAINERS
//

// JSON object returned for the PIE CHART 
// '{    
// "labels": [ "20GP86", "20TD86", "40GP86", "40GP96", "40RE96" ],
//       "datasets": [ {
//             "label": "Container Sizes",
//             "backgroundColor": [ "#713D99", "#7C14CC", "#CC8714", "#FFCA40", "#0400FF" ],
//             "hoverBackgroundColor": [ "#713D9980", "#7C14CC80", "#CC871480", "#FFCA4080", "#0400FF80" ],
//             "data": [ "67", "6", "2", "52", "25" ]
//       } ]
// }'
// *******************************************************

app.get('/locpie/:vessel', function (request, response) {

      let shiptrip = splitVessel(request.params.vessel);
      console.log("shiptrip: ", shiptrip);
      let qry = `SELECT location, COUNT(*) as count FROM upload_zed WHERE trip="${shiptrip}" GROUP BY location;`;
      let dashloc = [];

      con.query(qry, (err, res) => {
            if (err) throw err;
            let labels = [];
            let data = [];

            for (let i = 0; i < res.length; i++) {
                  labels.push(`${res[ i ].location}`);
                  data.push(`${res[ i ].count}`);
            }

            console.log('LABELS', labels);
            console.log('DATA', data);
            let temp = {
                  labels: labels,
                  datasets: [ {
                        label: 'Container Locations',
                        backgroundColor: [
                              '#713D99',
                              '#0400FF',
                              '#7C14CC',
                              '#CC8714',
                              '#FFCA40',
                        ],
                        hoverBackgroundColor: [
                              '#713D9950',
                              '#7C14CC50',
                              '#0400FF50',
                              '#FFCA4050',
                              '#CC871450'
                        ],
                        data: data
                  } ],
            };
            // console.log('LABELS', temp);
            dashloc.push(JSON.stringify(temp));
            // console.log(`dashloc: ${dashloc}`);
            response.send(dashloc);
      })
});


// *******************************************************
// CROP Vessel / QUANTITY per LOCATION of the CONTAINERS
// *******************************************************

function mergeVessel(start) {

      // receive > "ANAM / 002";
      // return > "ANAM002"
      let tmp = start.split('/');
      let res = tmp[ 0 ].trim() + tmp[ 1 ].trim();
      // console.log(res);
      return res
}

function splitVessel(start) {

      // receive > "ANAM002"
      // return > "ANAM / 002";
      let res = `${start.slice(0, 4)} / ${start.slice(4, start.length)}`;
      // console.log(res);
      return res
}


// *******************************************************
//    Provide START and END date for DaTABASE fetch
// *******************************************************

function dateRange() {

      // GET DATE 5 days earlier than TODAY
      // ++++++++++++++++++++++++++++++++++
      let today = new Date();
      let past = new Date(today.setDate(today.getDate() - 5));
      let dd = String(past.getDate()).padStart(2, '0');
      let mm = String(past.getMonth() + 1).padStart(2, '0');
      let yyyy = past.getFullYear();
      past = yyyy + '-' + mm + '-' + dd;

      // GET DATE 10 days ahead of TODAY
      // ++++++++++++++++++++++++++++++++++      
      let future = new Date(today.setDate(today.getDate() + 15));
      dd = String(future.getDate()).padStart(2, '0');
      mm = String(future.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = future.getFullYear();
      future = yyyy + '-' + mm + '-' + dd;

      //console.log('past: ', past);
      //console.log('future: ', future);
      return [ past, future ];
}





// NEW ENDPOINT
// *******************************************************
if (false) {
      app.get('/view', (req, res) => {
            let qry = `SELECT * FROM customer WHERE custID=${req.query.custID}`;
            console.log(`Query: view + ${req.query.custID}`);
            console.log(qry);
            // res.send(qry);
            con.query(qry, (err, response) => {
                  if (err) { throw err };
                  res.send(response[ 0 ]);
            })
      })

      app.get('/rid', (req, res) => {
            let qry = `SELECT firstName, lastName FROM customer WHERE custID='${req.query.refID}'`

            con.query(qry, (err, response) => {
                  if (err) { throw err };
                  res.send({
                        referralName: `${response[ 0 ].firstName} ${response[ 0 ].lastName}`
                  })
            })
      })

      // *******************************************************
      // ******** PUTs - the "U" in CRUD **********************
      // *******************************************************

      app.put('/update', (req, res) => {
            let qry = `UPDATE customer SET firstName='${req.body.firstName}', middleInitial='${req.body.middleInitial}', lastName='${req.body.lastName}', company='${req.body.company}', discount=${req.body.discount} WHERE custID=${req.body.custID}`;
            // res.send(qry);
            // console.log(qry);

            con.query(qry, (err) => {
                  if (err) { throw err };
                  res.send({
                        msg: 'Record Updated'
                  })
            })
      })

      app.put('/deactivate', (req, res) => {
            let qry = `UPDATE customer SET active=0, inactiveDate=CURDATE() WHERE custID=${req.body.custID}`;

            con.query(qry, (err) => {
                  if (err) { throw err };
                  res.send({
                        msg: 'Record Deactivated'
                  })
            })


      })

      // *******************************************************
      // ******** POSTs - the "C" in CRUD **********************
      // *******************************************************


      app.post('/signup', (req, res) => {
            let newRec = {
                  active: 1,
                  firstName: req.body.firstName,
                  middleInitial: req.body.middleInitial,
                  lastName: req.body.lastName,
                  company: req.body.company,
                  discount: 0,
                  referralID: req.body.referralID,
                  sinceDate: req.body.sinceDate,
                  inactiveDate: ""
            }

            let insertedID;

            con.query('INSERT INTO customer SET ?', newRec, (err, response) => {
                  if (err) throw err;
                  res.send({ msg: `Record Added with an ID of ${response.insertId}` });
                  insertedID = response.insertId;
            });

            setTimeout(() => {

                  let insertEmail = {
                        custID: insertedID,
                        dateCreated: req.body.sinceDate,
                        emailAddr: req.body.email,
                        emailType: 'primary',
                        active: 1
                  }


                  con.query('INSERT INTO email SET ?', insertEmail, (err) => {
                        if (err) throw err;
                        console.log('email record added');
                  });

            }, 5000)
      })


      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      // X*****************************************************X
      // X******* DELETEs - No Deletes, no "D" in CRUD ********X
      // X*****************************************************X
      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      // The Delete or Remove Operation simply calls the
      //      deactivate route

      // app.put('/delete', (req, res) => {
      //       let qry = `UPDATE customer SET active=0, inactiveDate=CURDATE() WHERE custID=${req.body.custID}`;

      //       con.query(qry, (err) => {
      //             if (err) { throw err };
      //             res.send({
      //                   msg: 'Record Deleted'
      //             })
      //       })


      // })
}

// *******************************************************
// ******** Start the Server *****************************
// *******************************************************
app.listen(port, () => {
      console.log(`\nServer is UP and RUNNING on PORT: ${port}\n...\n`)
})

// *******************************************************
// ******** End of Code **********************************
// *******************************************************

function orderArray(data, labels) {

      // ordering the array from largest to smallest count of containers
      let count = true;
      while (count) {

            count = false;
            for (let i = 0; i < data.length; i++) {

                  let test = data[ i ] - data[ i + 1 ];
                  if (test < 0) {
                        let tmpd = data[ i ];
                        let tmpl = labels[ i ];

                        data[ i ] = data[ i + 1 ];
                        labels[ i ] = labels[ i + 1 ];

                        data[ i + 1 ] = tmpd;
                        labels[ i + 1 ] = tmpl;

                        count = true;
                  }
            }
      }

      return [ data, labels ];

}

            // hsl(274, 23%, 42%)
            // hsl(43, 100%, 64%)
            // hsl(274, 82%, 44%)
            // hsl(37, 82%, 44%)
            // hsl(241, 100%, 50%)


            // hsl(209, 12%, 51%)         //z hsl(209, 62%, 51%)         // hsl(209, 52%, 31%)
            //i hsl(284, 59%, 44%)         //z hsl(284, 9%, 44%)         // hsl(284, 19%, 64%)
            //i hsl(40, 93%, 57%)          //z hsl(40, 43%, 57%)          // hsl(40, 53%, 37%)
            //i hsl(349, 96%, 41%)         //z hsl(349, 46%, 41%)         // hsl(349, 56%, 61%)
            //i hsl(12, 83%, 62%)          //z hsl(12, 33%, 62%)          // hsl(12, 43%, 42%)
            //i hsl(241, 100%, 50%)        //z hsl(241, 50%, 50%)         // hsl(241, 60%, 30%)
            //i hsl(274, 82%, 44%)         //z hsl(274, 32%, 44%)         // hsl(274, 42%, 64%)
            //i hsl(192, 54%, 56%)         //z hsl(192, 4%, 56%)         // hsl(192, 14%, 36%)
            //i hsl(161, 92%, 25%)         //z hsl(161, 42%, 25%)         // hsl(161, 52%, 45%)
            //i hsl(225, 64%, 33%)         //z hsl(225, 14%, 33%)         // hsl(225, 24%, 53%)