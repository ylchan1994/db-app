import React, { useEffect, useState } from 'react';
import Button from './button';
import Customer from './db-methods'

const DBNAME = 'customer_db';
const customerData = [
  { userid: '123', name: 'Bill', email: 'bill@ezypay.com' },
  { userid: '345', name: 'Donna', email: 'donna@myhome.org' }
];

export default function App() {
  const [ isEnabled, setIsEnabled ] = useState({
    load: true,
    query: true,
    clear: false,
  })
  const [ log, setLog ] = useState([]);
  const [ customerInfo, setCustomerInfo ] = useState([]);
  const [ filter, setFilter ] = useState({
    flag: false,
    field: '',
    value: ''
  });

//  Clear all customer data from the database
const clearDB = () => {
  const customer = new Customer(DBNAME);
  customer.removeAllRows(setLog);
  setIsEnabled({
    load: true,
    query: true,
    clear: false,
  });
}

// Add customer data to the database
function loadDB() {
  const customer = new Customer(DBNAME);
  customer.initialLoad(customerData, setLog);
  setIsEnabled({
    clear: true,
    load: false,
    query: true,
  })
}

function queryDB() {
  const customer = new Customer(DBNAME);
  setLog([]);
  customer.getCustomerData(setLog, setCustomerInfo);
}

function handleFilterField(event) {
  console.log(event.target);
  setFilter(prev => ({...prev, 
    flag: true,
    field: event.target.id
  }));
}

function handleFilterValue(event) {
  event.preventDefault();
  setFilter( prev => ({...prev, value: event.target.value}))
}

function handleFilter(event) {
  event.preventDefault();
  const customer = new Customer(DBNAME);
  console.log(event.target.value)
  customer.getCustomerData(setLog, setCustomerInfo, filter);
}

console.log(filter);

  return (
    <>
    <div className='grid grid-cols-5 h-screen'>
      <div className='flex col-span-4 flex-col'>
        <div>
          <Button description={'Load DB'} isEnabled={isEnabled.load} handleFunction={loadDB}/>
          <Button description={'Query All'} isEnabled={isEnabled.query} handleFunction={queryDB}/>
          <Button description={'Clear DB'} isEnabled={isEnabled.clear} handleFunction={clearDB}/>      
        </div>
        <div className='mx-3 my-2'>
          <input type='radio' id='name' name='filterField' 
            onChange={handleFilterField}></input>
          <label htmlFor='name'
            className='mx-2'>Name</label>
          <input type='radio' id='email' name='filterField' 
            onChange={handleFilterField}></input>
          <label htmlFor='email'
            className='mx-2'>Email</label>
            <input type='text' className='mx-3 my-2 border rounded border-black' onChange={handleFilterValue}></input>
            <Button description={'Filter'} isEnabled={isEnabled.query} name={'filter'} handleFunction={handleFilter}/>
        </div>        
        <div className='mxemail-5 mt-5'>
          <div className='grid grid-cols-3 place-items-center py-2 border border-x-0 border-t-0 border-t-black'>
            { customerInfo.length !== 0 ? (Object.keys( customerInfo[0] || {} ).map((key) => <p >{key}</p>) ) : <div>Nothing to show here</div> }
          </div>
          { customerInfo.map((customer) => {
            return (
              <div className='grid grid-cols-3 place-items-center py-2 border border-x-0'> 
                { Object.values(customer || {} ).map((value) => <p>{value}</p> ) }
              </div>
            )
          }) }
        </div>
      </div>
      <div className='border border-l border-l-black px-3 py-2 overflow-y-auto'>
        <h1>Logs:</h1>
        <ul>{log.map( (log) => (<><li className='my-2 text-xs'>{log}</li>
          <div className='border border-slate-300'></div></>) )}</ul>
      </div>
    </div>
    </>
  );
};
