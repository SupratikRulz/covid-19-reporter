import React from "react";

import "./CountryDetails.css";

const ACTIVE = "Active";
const CONFIRMED = "Confirmed";
const COUNTRY = "Country_Region";
const DEATHS = "Deaths";
const RECOVERED = "Recovered";
const LAST_UPDATE = "Last_Update";

export default function CountryDetails(props) {
  let data = props.data.map(_data => _data.attributes) || [];
  let countryName = "All Countries";
  const noData = data.length === 0;
  const aggregatedData = data.reduce(
    (detailObject, currentValue) => ({
      [CONFIRMED]: detailObject[CONFIRMED] + (currentValue[CONFIRMED] || 0),
      [RECOVERED]: detailObject[RECOVERED] + (currentValue[RECOVERED] || 0),
      [DEATHS]: detailObject[DEATHS] + (currentValue[DEATHS] || 0),
      [ACTIVE]: detailObject[ACTIVE] + (currentValue[ACTIVE] || 0),
      [LAST_UPDATE]:
        detailObject[LAST_UPDATE] < currentValue[LAST_UPDATE]
          ? currentValue[LAST_UPDATE]
          : detailObject[LAST_UPDATE]
    }),
    {
      [CONFIRMED]: 0,
      [RECOVERED]: 0,
      [DEATHS]: 0,
      [ACTIVE]: 0,
      [LAST_UPDATE]: 0
    }
  );

  if (!noData) {
    const country = data[0][COUNTRY];
    if (data.filter(_data => _data[COUNTRY] !== country).length) {
      countryName = "All Countries";
    } else {
      countryName = country;
    }
  }

  return noData ? (
    <h3>No Information Found. Please check the country name</h3>
  ) : (
    <>
      <p>
        Showing results for <span className="country-name">{countryName}</span>{" "}
      </p>
      <div className="last-update">
        Last Updated:{" "}
        <span>{new Date(aggregatedData[LAST_UPDATE]).toString()}</span>
      </div>
      <div>
        <div className="flex-center info-bar">
          <p>📈 Confirmed:</p> <p>{aggregatedData[CONFIRMED]}</p>
        </div>

        <div className="flex-center info-bar">
          <p>💪 Recovered:</p> <p>{aggregatedData[RECOVERED]}</p>
        </div>

        <div className="flex-center info-bar">
          <p>🏥 Active:</p> <p>{aggregatedData[ACTIVE]}</p>
        </div>

        <div className="flex-center info-bar">
          <p>☠️ Deaths:</p> <p>{aggregatedData[DEATHS]}</p>
        </div>
      </div>
    </>
  );
}
