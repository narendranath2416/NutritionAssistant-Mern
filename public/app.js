const API_URL = 'http://localhost:5000/api/logs';

// Fetch logs on screen load
document.addEventListener('DOMContentLoaded', fetchLogs);

// Handle new form submissions
document.getElementById('logForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const logData = {
    mealType: document.getElementById('mealType').value,
    foodItem: document.getElementById('foodItem').value,
    calories: Number(document.getElementById('calories').value),
    protein: Number(document.getElementById('protein').value),
    carbs: Number(document.getElementById('carbs').value),
    fats: Number(document.getElementById('fats').value)
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });

    if (response.ok) {
      document.getElementById('logForm').reset();
      fetchLogs();
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
});

// Fetch and display existing logs
async function fetchLogs() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    const tableBody = document.getElementById('logTableBody');
    tableBody.innerHTML = '';

    if (result.data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No meals logged today yet.</td></tr>`;
      return;
    }

    result.data.forEach(log => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="badge bg-secondary">${log.mealType}</span></td>
        <td class="fw-bold">${log.foodItem}</td>
        <td><span class="text-danger fw-bold">${log.calories} kcal</span></td>
        <td>
          <small class="text-primary">P: ${log.protein}g</small> | 
          <small class="text-success">C: ${log.carbs}g</small> | 
          <small class="text-warning">F: ${log.fats}g</small>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteLog('${log._効率}', this)">Delete</button>
        </td>
      `;
      // Patching MongoDB ID dynamically
      row.querySelector('button').setAttribute('onclick', `deleteLog('${log._id}')`);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}

// Delete log entry safely
async function deleteLog(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchLogs();
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
}