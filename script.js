// Function to add a new student row
function addStudentRow() {
  const table = document.getElementById("studentTable").getElementsByTagName("tbody")[0];
  const rowCount = table.rows.length;
  const row = table.insertRow(rowCount);

  row.innerHTML = `
    <td><input type="text" id="studentName${rowCount}" placeholder="Enter Student Name" required></td>
    <td><input type="number" id="correctAnswers${rowCount}" placeholder="Correct Answers" required></td>
  `;
}

// Function to generate the report
function generateReport() {
  const subjectName = document.getElementById("subjectName").value;
  const paperTitle = document.getElementById("papertitle").value;
  const practicalLevel = document.getElementById("practical-level").value;
  const coverArea = document.getElementById("coverarea").value;
  const totalQuestions = parseInt(document.getElementById("totalQuestions").value);
  const tableRows = document.getElementById("studentTable").getElementsByTagName("tbody")[0].rows;

  if (!subjectName || !paperTitle || !practicalLevel || !coverArea || isNaN(totalQuestions)) {
    alert("Please fill all required fields.");
    return;
  }

  let studentDetails = [];
  let totalMarks = 0;

  Array.from(tableRows).forEach((row, index) => {
    const studentName = document.getElementById(`studentName${index}`).value;
    const correctAnswers = parseInt(document.getElementById(`correctAnswers${index}`).value);

    if (studentName && !isNaN(correctAnswers)) {
      const marks = (correctAnswers / totalQuestions) * 100;
      const wrongAnswers = totalQuestions - correctAnswers;

      studentDetails.push({ studentName, marks, correctAnswers, wrongAnswers });
      totalMarks += marks;
    }
  });

  if (studentDetails.length === 0) {
    alert("No valid student data entered.");
    return;
  }

  document.getElementById("reportSubjectName").textContent = subjectName;
  document.getElementById("reportPapertitle").textContent = paperTitle;
  document.getElementById("reportpaperlevel").textContent = practicalLevel;
  document.getElementById("reportCoverArea").textContent = coverArea;
  document.getElementById("reporttask").textContent = totalQuestions;

  const resultsTable = document.getElementById("resultsTable").getElementsByTagName("tbody")[0];
  resultsTable.innerHTML = "";

  let topScorers = [];
  let lowScorers = [];
  let topMarks = -Infinity;
  let lowMarks = Infinity;

  studentDetails.forEach(student => {
    if (student.marks > topMarks) {
      topMarks = student.marks;
      topScorers = [student]; // New top scorer, reset the array
    } else if (student.marks === topMarks) {
      topScorers.push(student); // Same top score, add to array
    }

    if (student.marks < lowMarks) {
      lowMarks = student.marks;
      lowScorers = [student]; // New low scorer, reset the array
    } else if (student.marks === lowMarks) {
      lowScorers.push(student); // Same low score, add to array
    }

    const row = resultsTable.insertRow();
    row.innerHTML = `
      <td>${student.studentName}</td>
      <td>${student.marks.toFixed(2)}</td>
      <td>${student.correctAnswers}</td>
      <td>${student.wrongAnswers}</td>
      <td>${getGrade(student.marks)}</td>
    `;
  });

  const avgMarks = totalMarks / studentDetails.length;
  document.getElementById("avgMarks").textContent = avgMarks.toFixed(2);

  // Display top scorers and low scorers
  document.getElementById("topScorer").textContent = topScorers.map(student => `${student.studentName} (${student.marks.toFixed(2)} marks)`).join(", ");
  document.getElementById("lowScorer").textContent = lowScorers.map(student => `${student.studentName} (${student.marks.toFixed(2)} marks)`).join(", ");
}


// Function to calculate grades
function getGrade(marks) {
  if (marks >= 85) return "A+";
  if (marks >= 75) return "A";
  if (marks >= 70) return "A-";
  if (marks >= 65) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 55) return "B-";
  if (marks >= 50) return "C+";
  if (marks >= 45) return "C";
  if (marks >= 40) return "C-";
  if (marks >= 35) return "D";
  return "F";
}


// Function to download the report as PDF
function downloadPDF() {
  const resultSection = document.getElementById("report");

  if (!resultSection || resultSection.innerHTML.trim() === "") {
    alert("No result to download!");
    return;
  }

  const options = {
    margin: 1,
    filename:paperTitle +  "Practical_Marks_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(resultSection).set(options).save();
}



function downloadPDF() {
  const resultSection = document.getElementById("report");

  // Check if resultSection has content
  if (!resultSection || resultSection.innerHTML.trim() === '') {
      alert("No result to download!");
      return;
  }

  const paperName = document.getElementById('papertitle').value.trim();

  // Generate the filename in the desired format: paper name + name + Progress Report
  const filename = `${paperName || 'Unknown'} Practical_Marks_Summery_Report.pdf`;

  // Use html2pdf to convert the content of #resultSection to PDF
  const options = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF from the content of #resultSection
  html2pdf().from(resultSection).set(options).save();
}
