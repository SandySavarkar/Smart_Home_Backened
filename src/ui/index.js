const socket = io();

const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  //   buttonState = !buttonState;
  updateUI();
  const reqObject = {
    pinId: 16,
    value: true,
  };
  socket.emit('buttonState', JSON.stringify(reqObject));
});

const updateUI = () => {
  true ? toggleBtn.classList.add('on') : toggleBtn.classList.remove('on');
  toggleBtn.innerText = true ? 'Turn off' : 'Turn on';
};

socket.on('buttonState', state => {
  console.log('updated state', state);
  //   buttonState = state;
  updateUI();
});
