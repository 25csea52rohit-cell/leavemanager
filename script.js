const form = document.getElementById('leaveForm');
const leaveList = document.getElementById('leaveList');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const leave = {
        name: document.getElementById('name').value,
        staffId: document.getElementById('staffId').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: 'Pending'
    };

    let leaves = JSON.parse(localStorage.getItem('leaves') || "[]");
    leaves.push(leave);
    localStorage.setItem('leaves', JSON.stringify(leaves));

    displayLeaves();
    form.reset();
});

function displayLeaves() {
    leaveList.innerHTML = '';
    let leaves = JSON.parse(localStorage.getItem('leaves') || "[]");
    leaves.forEach((l, index) => {
        const li = document.createElement('li');
        li.textContent = `${l.name} (ID: ${l.staffId}) → ${l.startDate} to ${l.endDate} [${l.status}]`;
        leaveList.appendChild(li);
    });
}

// Load leaves on page load
displayLeaves();
