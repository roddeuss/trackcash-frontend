"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  value: string;
  onChange: (val: string) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [selected, setSelected] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelected(date);
    if (date) {
      // format dd-MM-yyyy HH:mm
      const formatted =
        ("0" + date.getDate()).slice(-2) +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        date.getFullYear() +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2);

      onChange(formatted);
    } else {
      onChange("");
    }
  };

  return (
    <DatePicker
      selected={selected}
      onChange={handleChange}
      showTimeSelect
      dateFormat="dd-MM-yyyy HH:mm"
      className="w-full rounded-md border px-3 py-2"
    />
  );
}
