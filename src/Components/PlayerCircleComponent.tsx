import React from "react";

interface PlayerCircleComponentProps {
  name: string;
  buzzedIn: boolean;
}

function getInitials(name: string | undefined) {
  if (!name || name.length === 0) return "";

  const nameSplit = name.split(" ", 2);
  if (nameSplit.length > 1) {
    // return the first two initials, i guess
    return nameSplit[0][0] + nameSplit[1][0];
  } else return name[0];
}

export default function PlayerCircleComponent(
  props: PlayerCircleComponentProps
) {
  return (
    <div className={`playerCircleDiv ${props.buzzedIn ? "highlight" : ""}`}>
      {getInitials(props.name)}
    </div>
  );
}
