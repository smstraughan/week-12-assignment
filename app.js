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

// In console type: npm install -g json-server
 //In console type: json-server --watch db.json



//Get from JSON Server -- this will both get from the server and add a row on the front end 
const URL = 'http://localhost:3000/runTrainingLog'

async function fetchRunData() {  //creating an async function using fetch to GET data from "back-end" json server
  const response = await fetch(URL) //use await so that we wait for this to run rather than getting back a promise
  const data = await response.json()

  //console log the data that we recieve from the backend
  console.log(data)

  //this renders the data front end in html
  data.forEach(run => {
    //create a table row for each run entry
    const row = `
    <tr data-id="${run.id}"> <!--comes in handy when we need to delete-->
      <td>${run.date}</td>
      <td>${run.workout}</td>
      <td>${run.distance}</td>
      <td>${run.time}</td>
      <td>
        <button class="delete-btn">Delete</button>
      </td>
    </tr>`
    $('tbody').append(row);//jquery to add the row to the table body
  });

  return data;

}

//Run the code for start up so that it is displaying when we open the page
fetchRunData()




//Adding Functionality to Form 

async function onAddRunClick(event) { //Again adding async to the function name so that it allows "await"
  event.preventDefault(); //prevents default behavior of submit button to reload page
  
  const newRun = { //collects the new run data from the form
    date: document.getElementById('date').value,
    workout: document.getElementById('workout').value,
    distance: document.getElementById('distance').value,
    time: document.getElementById('time').value
  };
  
  //Below we first update the back end JSON server
  try { //this try function allows us to catch errors
    const response = await fetch(URL, { //using the fetch method POST to add the data to the JSON server
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newRun)
    });
    
    const data = await response.json();
    
    //Below: If we successfully update the backend json server then we update the front end table
    if (response.ok) { // the data-id stores the id of the data entry for delete functionality later
        const row = `
      <tr data-id="${data.id}"> 
        <td>${data.date}</td>
        <td>${data.workout}</td>
        <td>${data.distance}</td>
        <td>${data.time}</td>
        <td>
          <button class="delete-btn">Delete</button>
        </td>
      </tr>`;
      
      document.querySelector('tbody').insertAdjacentHTML('beforeend', row);
      document.getElementById('new-run').reset(); //resets the run form to empty
    }
    
    //Catch throws an error if we do not successfully update the backend 
  } catch (error) {
    console.error('Error adding run:', error);
  }
}

// Attach to form button -- add event listener
document.getElementById('new-run').addEventListener('submit', onAddRunClick);


//Adding delete button functionality

document.querySelector('tbody').addEventListener('click', async function(event) { //adding an event listener to the tbody-- listens for click
  if (event.target.classList.contains('delete-btn')) { //if the click is on a delete button
    const row = event.target.closest('tr'); //we get the row of the delete button that was clicked
    const runId = row.dataset.id;  // Get the id from json server
    
    const deleteURL = `http://localhost:3000/runTrainingLog/${runId}`;//this takes us to the entry with the runID that we want to delete
    
    //First updating on the backend
    try {
      const response = await fetch(deleteURL, { //using fetch method DELETE
        method: 'DELETE'
      });
      
      if (response.ok) { //IF we are able to delete from backend then we update the front end
        row.remove();
        console.log('Entry deleted successfully');
      }
      
    } catch (error) { //throw an error if we are unable to delete on teh backend
      console.error('Error deleting entry:', error); 
    }
  }
});