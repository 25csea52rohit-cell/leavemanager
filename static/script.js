// Function for HOD to approve a leave
function updateStatus(index, newStatus) {
    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");

    // Update the status
    history[index].status = newStatus;

    // If approved, we confirm the replacement
    if (newStatus === 'Approved') {
        alert("Notification sent to " + history[index].name + " and replacement " + history[index].replacement);
    }

    localStorage.setItem('leaveHistory', JSON.stringify(history));
    renderLeaves(); // Refresh the view
}

function renderLeaves() {
    leaveList.innerHTML = '';
    const adminList = document.getElementById('adminLeaveList');
    adminList.innerHTML = ''; // Clear admin list too

    let history = JSON.parse(localStorage.getItem('leaveHistory') || "[]");

    history.forEach((entry, index) => {
        // User View (Standard List)
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${entry.name}</strong> - Status: <b>${entry.status}</b>
            <br>Replacement: ${entry.replacement}
        `;
        leaveList.appendChild(item);

        // HOD View (With Buttons)
        if (entry.status === 'Pending') {
            const adminItem = document.createElement('div');
            adminItem.style.border = "1px solid #ccc";
            adminItem.style.padding = "10px";
            adminItem.style.marginBottom = "5px";
            adminItem.innerHTML = `
                <p>${entry.name} (ID: ${entry.id}) wants leave from ${entry.start} to ${entry.end}</p>
                <p>Auto-Replacement: ${entry.replacement}</p>
                <button onclick="updateStatus(${index}, 'Approved')" style="background:green; color:white;">Approve</button>
                <button onclick="updateStatus(${index}, 'Rejected')" style="background:red; color:white;">Reject</button>
            `;
            adminList.appendChild(adminItem);
        }
    });
}