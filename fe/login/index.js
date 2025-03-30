const SERVER_URL = 'http://localhost:3000'
const loginButton = document.getElementById('mble-btn')
const mobileNumber = document.getElementById('mble-number')
const password = document.getElementById('password')
const username = document.getElementById('username')
const update = document.getElementById('update')
const skip = document.getElementById('skip')

function saveProfile(profile) {
  const request = indexedDB.open('ghibili_user_profile', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile');

    store.put({ id: 'me', ...profile });

    tx.oncomplete = () => console.log('Profile saved!');
    tx.onerror = (e) => console.error('Save error:', e.target.error);
  };
}

function getProfile(callback) {
  const request = indexedDB.open('ghibili_user_profile', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction('profile', 'readonly');
    const store = tx.objectStore('profile');

    const getReq = store.get('me');

    getReq.onsuccess = () => callback(getReq.result);
    getReq.onerror = (e) => console.error('Fetch error:', e.target.error);
  };
}

loginButton?.addEventListener('click', async () => {
  const res = await fetch(`${SERVER_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({
      mobileNumber: mobileNumber.value,
      password: password.value
    }),
    credentials: 'include'
  })

  const data = await res.json()

  if (data.status === 'NEW_USER') {
    saveProfile(data.message);
    document.getElementById('update-wrapper').style = "display: block"
    document.getElementById('login-wrapper').style = "display:none"
    return
  }

  if (data.status === 'PASSWORD_ERR') {
    alert("Password Wrong!")
    return
  }

  if (data.status === 'SUCCESS') {
    saveProfile(data.message);
    window.location = '/'
    return
  }

  alert("Something wrong")
})

update?.addEventListener('click', async () => {
  const res = await fetch(`${SERVER_URL}/update`, {
    method: 'PUT',
    body: JSON.stringify({
      username: username.value
    }),
    credentials: 'include'
  })

  const data = await res.json()

  if (data.status === 'SUCCESS') {
    saveProfile(data.message);
    window.location = '/'
    return
  }

  alert("Something wrong!")
})


skip.addEventListener('click', () => {
  window.location = '/'
})

function main() {
  getProfile((profile) => {
    if (profile) {
      window.location = '/'
    }
  });
}


main()
