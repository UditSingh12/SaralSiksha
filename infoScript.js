// Fetch existing student information
async function fetchStudentInfo() {
    const response = await fetch(`/get-students`);
    const students = await response.json();

    const studentInfoList = document.getElementById('student-info-list');
    studentInfoList.innerHTML = '';

    students.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-info';

        const idLabel = document.createElement('label');
        idLabel.textContent = `ID: ${student._id}`;

        const nameLabel = document.createElement('label');
        nameLabel.textContent = `Name: ${student.name}`;

        const academicPerformanceLabel = document.createElement('label');
        academicPerformanceLabel.textContent = `Academic Performance: ${student.academicPerformance || 'N/A'}`;

        const finalPercentageLabel = document.createElement('label');
        finalPercentageLabel.textContent = `Final Percentage: ${student.finalPercentage || 'N/A'}`;

        const addressLabel = document.createElement('label');
        addressLabel.textContent = `Address: ${student.address || 'N/A'}`;

        const scholarshipLabel = document.createElement('label');
        scholarshipLabel.textContent = `Eligible for Scholarship: ${student.finalPercentage > 90 ? 'Yes' : 'No'}`;

        studentDiv.appendChild(idLabel);
        studentDiv.appendChild(nameLabel);
        studentDiv.appendChild(academicPerformanceLabel);
        studentDiv.appendChild(finalPercentageLabel);
        studentDiv.appendChild(addressLabel);
        studentDiv.appendChild(scholarshipLabel);

        studentInfoList.appendChild(studentDiv);
    });
}

// Add student information
async function addStudentInfo() {
    const studentId = document.getElementById('studentId').value;
    const academicPerformance = document.getElementById('academicPerformance').value;
    const finalPercentage = document.getElementById('finalPercentage').value;
    const address = document.getElementById('address').value;

    if (studentId && academicPerformance && finalPercentage && address) {
        try {
            const response = await fetch('/add-student-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, academicPerformance, finalPercentage, address }),
            });

            const data = await response.text();
            console.log(data); // Log the server response for debugging

            document.getElementById('studentId').value = '';
            document.getElementById('academicPerformance').value = '';
            document.getElementById('finalPercentage').value = '';
            document.getElementById('address').value = '';
            fetchStudentInfo(); // Refresh the student information list
        } catch (error) {
            console.error('Error adding student information:', error); // Log any errors for debugging
        }
    }
}

// Initialize the page
function init() {
    fetchStudentInfo();
}

init();
