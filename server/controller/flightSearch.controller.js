var Amadeus = require("amadeus");
var moment = require("moment");
const { parse, toSeconds } = require("iso8601-duration");
const airlineCodes = require("../airline-codes.json");

module.exports.flightSearch = (req, res) => {
  let currency = req.body.currency;
  let departure = req.body.departure;
  let departureDate = req.body.departureDate;
  let arrival = req.body.arrival;
  let returnDate = req.body.returnDate;
  let adults = req.body.adults;
  let children = req.body.children;
  let infants = req.body.infants;
  let travelClass =
    req.body.travelClass == null ? "ECONOMY" : req.body.travelClass;
  var amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
  });
  let flightDetails = [];
  let flightData = [];
  let commonObj = {
    currencyCode: currency,
    originLocationCode: departure,
    destinationLocationCode: arrival,
    departureDate: departureDate,
    adults: adults,
    children: children,
    infants: infants,
    travelClass: travelClass,
  };
  let queryObj = commonObj;
  if (returnDate != null || returnDate != "")
    queryObj = { ...commonObj, returnDate: returnDate };
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
