import { useState } from 'react';

const units = {
  volume: {
    tsp: 1,
    tbsp: 3,
    cup: 48,
    pint: 96,
    quart: 192,
    gallon: 768,
    liter: 202.884,
  },
  weight: {
    gram: 1,
    kilogram: 1000,
    ounce: 28.3495,
    pound: 453.592,
  },
};

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('tsp');
  const [outputUnit, setOutputUnit] = useState('tbsp');
  const [outputValue, setOutputValue] = useState('');

  const handleConvert = () => {
    const inputInBase = inputValue * units.volume[inputUnit] || units.weight[inputUnit];
    const result = inputInBase / (units.volume[outputUnit] || units.weight[outputUnit]);
    setOutputValue(result);
  };

  return (
    <div className="unit-converter">
      <h3>Convert Units</h3>
      <div className="conversion-input">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
          <optgroup label="Volume">
            {Object.keys(units.volume).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
          <optgroup label="Weight">
            {Object.keys(units.weight).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="conversion-output">
        <input type="text" value={outputValue} readOnly placeholder="Result" />
        <select value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)}>
          <optgroup label="Volume">
            {Object.keys(units.volume).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
          <optgroup label="Weight">
            {Object.keys(units.weight).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <button onClick={handleConvert}>Convert</button>
    </div>
  );
}