function createIndexedDB() {
  const request = indexedDB.open('ghibili_user_profile', 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('profile', { keyPath: 'id' });
  };

  request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
  };
}

createIndexedDB()
