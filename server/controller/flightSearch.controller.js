var Amadeus = require("amadeus");
var moment = require("moment");
const airlineCodes = require("../airline-codes.json");

module.exports.flightSearch = (req, res) => {
  var amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
  });
  let flightDetails = [];
  let flightData = [];
  let commonObj = {
    currencyCode: req.body.currencyCode,
    originLocationCode: req.body.originLocationCode,
    destinationLocationCode: req.body.destinationLocationCode,
    departureDate: req.body.departureDate,
    adults: req.body.adults,
    children: req.body.children,
    infants: req.body.infants,
  };
  let queryObj = commonObj;
  if (req.body.returnDate != null && req.body.returnDate != "")
    queryObj = { ...commonObj, returnDate: req.body.returnDate };
  if (req.body.travelClass != null && req.body.travelClass != "")
    queryObj = { ...commonObj, travelClass: req.body.travelClass };
  console.log("body", req.body);
  console.log("query_obj", queryObj);
  amadeus.shopping.flightOffersSearch
    .get(queryObj)
    .then((response) => {
      response.data.forEach((flight) => {
        flightDetails = {
          duration: toHoursAndMinutes(
            flight.itineraries[0].segments[0].departure.at,
            flight.itineraries[0].segments[0].arrival.at
          ),
          terminal: flight.itineraries[0].segments[0].departure.terminal,
          departureTime: moment(
            flight.itineraries[0].segments[0].departure.at
          ).format("DD-MM-YYYY hh:mm A"),
          arrivalTime: moment(
            flight.itineraries[0].segments[0].arrival.at
          ).format("DD-MM-YYYY hh:mm A"),
          carrierCode:
            flight.itineraries[0].segments[0].carrierCode +
            " " +
            flight.itineraries[0].segments[0].number,
          carrierName: airlineCodes.find(
            (result) =>
              result.id == flight.itineraries[0].segments[0].carrierCode
          ).name,
          NumOfStops: flight.itineraries[0].segments[0].numberOfStops,
        };
        flightData.push(flightDetails);
      });
      return res.status(200).json({ response: flightData });
    })
    .catch((responseError) => {
      console.log("error", responseError);
      return res.status(400).json({ error: responseError });
    });
  function toHoursAndMinutes(dept, arrival) {
    var diff_s = moment(arrival).diff(moment(dept), "seconds");
    return {
      h: moment
        .utc(moment.duration(diff_s, "seconds").asMilliseconds())
        .format("hh"),
      m: moment
        .utc(moment.duration(diff_s, "seconds").asMilliseconds())
        .format("mm"),
    };
  }
};
