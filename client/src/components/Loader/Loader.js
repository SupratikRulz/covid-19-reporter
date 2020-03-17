import React from "react";

import RLoader from "react-loaders";

export default function Loader() {
  return (
    <div className="Loader">
      <RLoader
        type="ball-scale-multiple"
        active
        innerClassName="flex-center"
        color="#DC143C"
      />
    </div>
  );
}
