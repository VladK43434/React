
import React,{useState,useEffect,useMemo} from 'react';
import Papa from 'papaparse';
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer} from 'recharts';
import './App.css';

const BRENT_URL='/data/brent.csv';
const WTI_URL='/data/wti.csv';

function parseCsv(text){
  const {data}=Papa.parse(text.trim(),{header:true,dynamicTyping:true});
  return data.filter(r=>r.Date&&r.Close).map(r=>({date:r.Date,price:+r.Close}));
}

export default function App(){
  const [brent,setBrent]=useState([]);
  const [wti,setWti]=useState([]);
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');

  useEffect(()=>{
    fetch(BRENT_URL).then(r=>r.text()).then(t=>setBrent(parseCsv(t)));
    fetch(WTI_URL).then(r=>r.text()).then(t=>setWti(parseCsv(t)));
  },[]);

  const data=useMemo(()=>{
    if(!brent.length||!wti.length) return [];
    const map=new Map();
    brent.forEach(d=>map.set(d.date,{date:d.date,brent:d.price}));
    wti.forEach(d=>{
      const obj=map.get(d.date)||{date:d.date};
      obj.wti=d.price;
      map.set(d.date,obj);
    });
    return Array.from(map.values())
      .filter(d=>d.brent&&d.wti&&(!from||d.date>=from)&&(!to||d.date<=to))
      .sort((a,b)=>a.date.localeCompare(b.date));
  },[brent,wti,from,to]);

  if(!data.length) return <div className="loading">Loading data…</div>;

  return(
    <div className="wrapper">
      <h1>Brent vs WTI</h1>
      <div className="controls">
        <label>From:<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label>
        <label>To:<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label>
      </div>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc"/>
          <XAxis dataKey="date" minTickGap={20}/>
          <YAxis domain={['auto','auto']}/>
          <Tooltip/>
          <Legend/>
          <Line dataKey="brent" name="Brent" stroke="#FF0000" dot={false}/>
          <Line dataKey="wti" name="WTI" stroke="#0000FF" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
