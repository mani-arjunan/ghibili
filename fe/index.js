const SERVER_URL = 'http://localhost:3000'
const mainSection = document.getElementById('main-section')
const imageInput = document.getElementById('image-input')
const logoutBtn = document.getElementById('log-out')

function deleteProfile() {
  const request = indexedDB.open('ghibili_user_profile', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile');

    const deleteReq = store.delete('me');

    deleteReq.onsuccess = () => console.log('Profile deleted!');
    deleteReq.onerror = (e) => console.error('Delete error:', e.target.error);
  };
}


logoutBtn.addEventListener('click', async () => {
  deleteProfile()
  const res = await fetch(`${SERVER_URL}/logout`, {
    credentials: 'include'
  })
  const data = await res.json()

  if (res.status === 200 && data.status === 'SUCCESS') {
    window.location = '/'
  }
})

const uploadImage = async () => {
  const image = imageInput
  const formData = new FormData()

  formData.append('file', image.files[0])
  formData.append('name', image.files[0].name)
  const res = await fetch(`${SERVER_URL}/generate`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
}


async function main() {
  const res = await fetch(`${SERVER_URL}/images`, {
    credentials: 'include'
  })
  const status = res.status

  const data = await res.json()

  if (status === 401 && data.status === 'UNAUTHORIZED') {
    window.location = "/login"
  }
}

(async () => {
  await main()
})()
