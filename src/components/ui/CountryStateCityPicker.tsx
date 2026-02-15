import * as React from "react";
import { Country, State, City } from "country-state-city";

export function CountryStateCityPicker({ value, onChange }: {
  value: { country: string; state: string; city: string };
  onChange: (val: { country: string; state: string; city: string }) => void;
}) {
  const { country, state, city } = value;
  const countries = Country.getAllCountries();
  const states = country ? State.getStatesOfCountry(country) : [];
  const cities = country && state ? City.getCitiesOfState(country, state) : [];

  return (
    <div className="flex flex-col gap-2">
      <select
        className="border rounded p-2"
        value={country}
        onChange={e => onChange({ country: e.target.value, state: "", city: "" })}
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
        ))}
      </select>
      <select
        className="border rounded p-2"
        value={state}
        onChange={e => onChange({ country, state: e.target.value, city: "" })}
        disabled={!country}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
        ))}
      </select>
      <select
        className="border rounded p-2"
        value={city}
        onChange={e => onChange({ country, state, city: e.target.value })}
        disabled={!state}
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
