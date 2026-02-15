import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar({ selected, onSelect, mode = "multiple" }: {
  selected: Date[];
  onSelect: (dates: Date[]) => void;
  mode?: "multiple";
}) {
  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={(dates: Date[] | undefined) => onSelect(dates || [])}
      showOutsideDays
      fixedWeeks
      required={false}
    />
  );
}
