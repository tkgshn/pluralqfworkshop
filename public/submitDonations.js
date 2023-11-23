document.getElementById('submit').addEventListener('click', function() {
  const donations = [];
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    const id = input.id.replace('donation_', '');
    const amount = Number(input.value);
    donations.push({ id, amount });
  });
  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get('user_id');
  console.table(user_id, donations)
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, donations }),
  });
});
