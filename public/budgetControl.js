window.onload = function() {
console.log('budgetControl.js loaded')
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      let total = 0;
      inputs.forEach(input => {
        total += Number(input.value);
      });
      const budget = Number(document.getElementById('budget').innerText);
      const remainingBudget = budget - total;
      if (remainingBudget < 0) {
        alert('Total donations exceed the budget!');
        this.value = '';
      } else {
        document.getElementById('remaining_budget').innerText = remainingBudget;
      }
    });
  });
};
