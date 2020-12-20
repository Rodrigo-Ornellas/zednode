Class Scheduler{

      // ERD = EARLIEST RECEIVING DATE - earlest date a container can enter the port
      // ETA = ESTIMATED TIME OF ARRIVAL - date of arrival of the vessel
      // ETD = ESTIMATED DATE OF DEPARTURE

      constructor(vesselCode, service, erdDate, erdTime, cutoffDate, cutoffTime, freetime, etaDate, etaTime, arrived, etdDate, etdTime) {
            this.vesselCode = vesselCode;
            this.service = service;

            // FIRST DATE CONTAINER ALLOWED ENTER PORT (TRUCK)
            this.erdDate = erdDate;
            this.erdTime = erdTime;

            // CONTAINER LOADING END DATE
            this.cutoffDate = cutoffDate;
            this.cutoffTime = cutoffTime;

            // FIRST DATE CONTAINER ALLOWED ENTER PORT (RAIL)
            this.freetime = freetime;

            // VESSEL ARRIVAL
            this.etaDate = etaDate;
            this.etaTime = etaTime;
            this.arrived = arrived;

            // VESSEL DEPARTURE
            this.etdDate = etdDate;
            this.etdTime = etdTime;

      }



}

export default Scheduler;

