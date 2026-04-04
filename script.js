// Fetch existing students and populate the list for attendance
async function fetchAttendanceStudents() {
    const response = await fetch(`/get-students`);
    const students = await response.json();

    const studentsList = document.getElementById('attendance-list');
    studentsList.innerHTML = '';

    students.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = student.name;

        const attendanceCheckbox = document.createElement('input');
        attendanceCheckbox.type = 'checkbox';
        attendanceCheckbox.name = student._id; // set student ID as checkbox name
        attendanceCheckbox.value = 'Present'; // set checkbox value to 'Present'

        const attendanceLabel = document.createElement('label');
        attendanceLabel.textContent = 'Present';

        studentDiv.appendChild(nameLabel);
        studentDiv.appendChild(attendanceCheckbox);
        studentDiv.appendChild(attendanceLabel);

        studentsList.appendChild(studentDiv);
    });
}

// Fetch existing students and populate the list for meals
async function fetchMealsStudents() {
    const selectedDate = document.getElementById('selectedDate').value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const response = await fetch(`/get-students`);
    const students = await response.json();

    const studentsList = document.getElementById('meals-list');
    studentsList.innerHTML = '';

    students.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = student.name;

        const mealCheckbox = document.createElement('input');
        mealCheckbox.type = 'checkbox';
        mealCheckbox.name = student._id; // set student ID as checkbox name
        mealCheckbox.value = 'Received'; // set checkbox value to 'Received'

        const mealLabel = document.createElement('label');
        mealLabel.textContent = 'Received';

        studentDiv.appendChild(nameLabel);
        studentDiv.appendChild(mealCheckbox);
        studentDiv.appendChild(mealLabel);

        studentsList.appendChild(studentDiv);
    });
}

// Submit meal records
async function submitMeals() {
    const selectedDate = document.getElementById('selectedDate').value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const mealData = {};

    checkboxes.forEach(checkbox => {
        mealData[checkbox.name] = checkbox.checked ? 'Received' : 'Not Received';
    });

    await fetch('/submit-meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: formattedDate, meals: mealData }),
    });

    alert('Meal records submitted successfully');
}

// Add new student
// Add new student
async function addStudent() {
    const newStudentName = document.getElementById('newStudentName').value; // Ensure this element ID matches your input field ID

    if (newStudentName) {
        try {
            const response = await fetch('/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newStudentName }),
            });

            const data = await response.text();
            console.log(data); // Log the server response for debugging

            document.getElementById('newStudentName').value = '';
            fetchMealsStudents(); // Refresh the student list for meals
            fetchAttendanceStudents(); // Refresh the student list for attendance
        } catch (error) {
            console.error('Error adding student:', error); // Log any errors for debugging
        }
    }
}


// Submit attendance
async function submitAttendance() {
    const selectedDate = document.getElementById('selectedDate').value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const attendanceData = {};

    checkboxes.forEach(checkbox => {
        attendanceData[checkbox.name] = checkbox.checked ? 'Present' : 'Absent';
    });

    await fetch('/submit-attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: formattedDate, attendance: attendanceData }),
    });

    alert('Attendance submitted successfully');
}

// Initialize the page
function init() {
    fetchAttendanceStudents();
    fetchMealsStudents();
}

init();
