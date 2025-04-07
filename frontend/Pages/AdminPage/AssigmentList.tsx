import React from "react";
import AssigmentItem from "./AssigmentItem";

interface SavedAssignment {
  _id: string;
  title: string;
  assignments: {
    teacherName: string;
    className: string;
    hours: number;
  }[];
}

interface AssigmentListProps {
  currentMaps: SavedAssignment[];
  setSelectedMap: React.Dispatch<React.SetStateAction<SavedAssignment | null>>;
  setMaps: React.Dispatch<React.SetStateAction<SavedAssignment[]>>;
}

const AssigmentList = ({
  currentMaps,
  setSelectedMap,
  setMaps,
}: AssigmentListProps) => {
  return (
    <>
      {currentMaps.map((map) => (
        <AssigmentItem
          map={map}
          setMaps={setMaps}
          setSelectedMap={setSelectedMap}
        />
      ))}
    </>
  );
};

export default AssigmentList;
