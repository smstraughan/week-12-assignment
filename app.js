/*
-Create a CRD application (CRUD without update) using json-server or another API
-Use fetch and async/await to interact with the API
-Use a form to create/post new entities
-Build a way for users to delete entities
-Include a way to get entities from the API and display them
-You do NOT need update, but you can add it if you'd like
-Use Bootstrap and/or CSS to style your project
*/



//Setup Json Server

//Get from JSON Server -- this will both get from the server and add a row on the front end 

const URL = 'http://localhost:3000/studentRoster'

async function fetchStudentData() {
  const response = await fetch(URL)
  const data = await response.json()

  data.forEach(student => {
    //create a table row for each student
    const row = `
    <tr>
      <td>${student.fullName}</td>
      <td>${student.researchAssignment}</td>
      <td>${student.id}</td>
      <td>
        <button class="edit-btn">Edit</button>
      </td>
      <td>
        <button class="delete-btn">Delete</button>
      </td>
    </tr>;
    //Append to table body`
    $('tbody').append(row);
  });

  return data;

}

fetchStudentData()




//MAKING a form work with functioning submit button

async function submitNewStudent(event) {
  event.preventDefault(); // Stop form from reloading page
  
  const URL = 'http://localhost:3000/studentRoster';
  
  // Create the new student object
  const newStudent = {
    fullName: document.getElementById('name').value,
    researchAssignment: document.getElementById('animal').value
  };
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newStudent)
    });
    
    const data = await response.json(); // Server returns the new student with ID
    
    // Add the new row to the table
    const row = `
    <tr>
      <td>${data.fullName}</td>
      <td>${data.researchAssignment}</td>
      <td>${data.id}</td>
      <td>
        <button class="edit-btn">Edit</button>
      </td>
      <td>
        <button class="delete-btn">Delete</button>
      </td>
    </tr>`;
    
    document.querySelector('tbody').insertAdjacentHTML('beforeend', row);
    
    // Clear the form
    document.getElementById('name').value = '';
    document.getElementById('animal').value = '';
    
  } catch (error) {
    console.error('Error submitting student:', error);
  }
}

// Attach to form submit event
document.querySelector('form').addEventListener('submit', submitNewStudent);
