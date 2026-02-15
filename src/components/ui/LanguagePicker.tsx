import * as React from "react";

const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Odia",
  "Punjabi",
  "Malayalam",
  "Assamese",
  "Maithili",
  "Santali",
  "Kashmiri",
  "Nepali",
  "Konkani",
  "Sindhi",
  "Dogri",
  "Manipuri",
  "Bodo",
  "Santhali",
  "Other"
];

export function LanguagePicker({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    onChange(selected);
  }
  return (
    <select
      multiple
      value={value}
      onChange={handleChange}
      className="w-full h-32 border rounded p-2 text-sm focus:outline-primary"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
}
