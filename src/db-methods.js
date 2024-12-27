class Customer {
  constructor(dbName) {
    this.dbName = dbName;
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. \
        Such and such feature will not be available.");
    }
  }

  /**
   * Remove all rows from the database
   * @memberof Customer
   */
  removeAllRows = (setLog) => {
    const request = indexedDB.open(this.dbName);

    request.onerror = (event) => {
      setLog( (prevLog) => [...prevLog, 'removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message]);
    };

    request.onsuccess = (event) => {
      setLog((prevLog) => [...prevLog, 'Deleting all customers...']);
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        setLog((prevLog) => [...prevLog, 'removeAllRows - Txn error: ', event.target.error.code,
          " - ", event.target.error.message]);
      };
      txn.oncomplete = (event) => {
        setLog((prevLog) => [...prevLog, 'All rows removed!']);
      };
      const objectStore = txn.objectStore('customers');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = (event) => {
        getAllKeysRequest.result.forEach(key => {
          objectStore.delete(key);
        });
      }
    }
  }

  getCustomerData = (setLog, setCustomerInfo, filter) => {
    const request = indexedDB.open(this.dbName);

    request.onerror = (event) => {
      setLog( (prevLog) => [...prevLog, 'removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message]);
    };

    request.onsuccess = (event) => {
      setLog((prevLog) => [...prevLog, 'Querying Customer...']);
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        setLog((prevLog) => [...prevLog, 'queryCustomer - Txn error: ', event.target.error.code,
          " - ", event.target.error.message]);
      };
      txn.oncomplete = (event) => {
        setLog((prevLog) => [...prevLog, 'Done querying customer']);
      };

      let getCustomer = undefined;
      
      if (filter && filter.flag) {
        console.log(filter.field, filter.value)
        getCustomer = txn.objectStore('customers').index(filter.field).getAll(filter.value);
      } else {
        getCustomer = txn.objectStore('customers').getAll();
      }
      
      getCustomer.onsuccess = (event) => {
        setCustomerInfo(getCustomer.result);
      }
    }
  }

  /**
   * Populate the Customer database with an initial set of customer data
   * @param {[object]} customerData Data to add
   * @memberof Customer
   */
  initialLoad(customerData, setLog) {
    const request = indexedDB.open(this.dbName);

    request.onerror = (event) => {
      setLog((prevLog) => [...prevLog, 'initialLoad - Database error: ', event.target.error.code,
        " - ", event.target.error.message]);
    };

    request.onupgradeneeded = (event) => {
      setLog((prevLog) => [...prevLog, 'Populating customers...']);
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      objectStore.onerror = (event) => {
        setLog((prevLog) => [...prevLog, 'initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message]);
      };

      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      
      txn.onerror = (event) => {
        setLog((prevLog) => [...prevLog, 'Failed to add customer', event.target.error.message])
      }
      txn.oncomplete = (event) => {
        setLog((prevLog) => [...prevLog, 'Complete adding customer'])
        db.close();
      }

      const objectStore = txn.objectStore('customers');
      customerData.forEach(customer => {
        objectStore.add(customer);
      });
    };
  }
}

export default Customer;