// 1. DATABASE SIMULATION
let staffDatabase = [
    { id: "101", name: "Dr. Arun", onLeave: false },
    { id: "102", name: "Prof. Banu", onLeave: false },
    { id: "103", name: "Mr. Chandran", onLeave: false },
    { id: "104", name: "Ms. Devi", onLeave: false }
];

const form = document.getElementById('leaveForm');

// 2. APPLY LEAVE LOGIC
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const staffId = document.getElementById('staffId').value;
    const staffName = document.getElementById('staffName').value;
    const applicant = staffDatabase.find(s => s.id === staffId);

    if (!applicant) {
        alert("Staff ID not found in system!");
        return;
    }

    // SMART REPLACEMENT: Find first person who is NOT the applicant and NOT on leave
    const available = staffDatabase.filter(s => s.id !== staffId && s.onLeave === false);
    let replacement = available.length > 0 ? available[0].name : "NO STAFF AVAILABLE";

    const leaveEntry = {
        name: staffName,
        id: staffId,
        start: document.getElementById('startDate').value,
        end: document.getElementById('endDate').value,
        replacement: replacement,
        status: "Pending",
        timestamp: new Date().toLocaleString()
    };

    // Mark as on leave to prevent them being picked as a replacement for the next person
    applicant.onLeave = true;

    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");
    history.push(leaveEntry);
    localStorage.setItem('leaveHistory', JSON.stringify(history));

    renderAll();
    form.reset();
});

// 3. HOD APPROVAL LOGIC
function updateStatus(index, newStatus) {
    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");
    history[index].status = newStatus;
    localStorage.setItem('leaveHistory', JSON.stringify(history));
    renderAll();
}

// 4. EXPORT TO EXCEL LOGIC
function exportToCSV() {
    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");
    if (history.length === 0) return alert("No records!");

    let csv = "Staff Name,ID,Start Date,End Date,Replacement,Status\n";
    history.forEach(r => {
        csv += `${r.name},${r.id},${r.start},${r.end},${r.replacement},${r.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Leave_Report.csv');
    a.click();
}

// 5. RENDER UI
function renderAll() {
    const leaveList = document.getElementById('leaveList');
    const adminList = document.getElementById('adminLeaveList');
    leaveList.innerHTML = '';
    adminList.innerHTML = '';

    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");

    history.forEach((entry, index) => {
        // Staff View
        const li = document.createElement('li');
        li.className = `status-${entry.status}`;
        li.innerHTML = `<strong>${entry.name}</strong> - ${entry.status}<br>
                        Replacement: ${entry.replacement} (${entry.start})`;
        leaveList.appendChild(li);

        // HOD View
        if (entry.status === "Pending") {
            const div = document.createElement('div');
            div.className = "admin-card";
            div.innerHTML = `
                <p><strong>${entry.name}</strong> wants leave</p>
                <p>Assigning: ${entry.replacement}</p>
                <div class="admin-btns">
                    <button onclick="updateStatus(${index}, 'Approved')" style="background:green; color:white;">Approve</button>
                    <button onclick="updateStatus(${index}, 'Rejected')" style="background:red; color:white;">Reject</button>
                </div>`;
            adminList.appendChild(div);
        }
    });
}

renderAll();