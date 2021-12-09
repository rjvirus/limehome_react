import Card from "./Card";
import React from "react";

export default function Cards(props)  {
    const { properties, favourites, setFavourites } = props;
    return (
      <div className="row">
        {properties?.map((data) => {
          const indexInDB = favourites.indexOf(data.id)
          return (
            <Card
              key={data.id}
              selected={indexInDB !== -1}
              position={indexInDB}
              updateFavourites={setFavourites}
              {...data}
            />
          )
        })}
      </div>
    )
  }