import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { parseISO } from 'date-fns';
import './App.css';

export default function App() {
  const [rawData, setRawData] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    fetch('sample-data.json')
      .then(r => r.json())
      .then(d => {
        setRawData(d);
        setStart(d[0].date);
        setEnd(d[d.length - 1].date);
      });
  }, []);

  const filtered = useMemo(() => {
    return rawData.filter(
      item => (!start || item.date >= start) && (!end || item.date <= end)
    );
  }, [rawData, start, end]);

  return (
    <div className="container">
      <h1>Oil Prices – Brent &amp; WTI</h1>

      <div className="controls">
        <label>
          Start:
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </label>
        <label>
          End:
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </label>
      </div>

      <ResponsiveContainer width="95%" height={400}>
        <LineChart data={filtered}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="date"
            tickFormatter={str => str.slice(5)}
            minTickGap={20}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="brent" name="Brent" stroke="#FF0000" dot={false} />
          <Line type="monotone" dataKey="wti" name="WTI" stroke="#0000FF" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}