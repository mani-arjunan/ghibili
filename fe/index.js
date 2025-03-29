const SERVER_URL = 'http://localhost:3000'
const loginButton = document.getElementById('mble-btn')
const mobileNumber = document.getElementById('mble-number')
const password = document.getElementById('password')
const username = document.getElementById('username')
const update = document.getElementById('update')
const skip = document.getElementById('skip')
const mainSection = document.getElementById('main-section')
const imageInput = document.getElementById('image-input')

loginButton.addEventListener('click', async () => {
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
    document.getElementById('update-wrapper').style = "display: block"
    document.getElementById('login-wrapper').style = "display:none"
    return
  }
  mainSection.style = "display: block"
})

update.addEventListener('click', async () => {
  const res = await fetch(`${SERVER_URL}/update`, {
    method: 'PUT',
    body: JSON.stringify({
      username: username.value
    }),
    credentials: 'include'
  })

  const data = await res.json()

  mainSection.style = "display: block"
})


const uploadImage = async () => {
  const image = imageInput
  const formData = new FormData()

  formData.append('file', image.files[0])
  formData.append('name', image.files[0].name)
  const res = await fetch(`${SERVER_URL}/generate`, {
    method: 'POST',
    body: formData,
  })
}
