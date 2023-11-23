fetch('/admin')
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById('donationsTable');
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.project_id}</td><td>${row.title}</td><td>${row.total_amount}</td><td>${row.donors}</td>`;
        table.appendChild(tr);
    });
  });
