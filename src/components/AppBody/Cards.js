import React from "react";
import Card from "../common/Card";

export default function Cards(props) {
  const { properties, favourites, setFavourites } = props;
  return (
    <div className="row">
      {properties?.map((data) => {
        const savedIndex = favourites?.indexOf(data.id); //checking if property is marked as favourite
        return (
          <Card
            key={data.id}
            selected={savedIndex !== -1 && savedIndex !== undefined}
            position={savedIndex}
            updateFavourites={setFavourites}
            {...data}
          />
        )
      })}
    </div>
  )
}