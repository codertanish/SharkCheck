const idDigits = 8 // Number of digits present in ID.
let reference = [];
let scriptURL = "";

fetch('/config')
  .then(res => res.json())
  .then(data => {
    scriptURL = data.scriptURL;
  });

  function toggleUpload() {
    const modal = document.getElementById("popupModal");
    modal.classList.toggle("hidden");
  }

  function submitUpload() {
    const password = document.getElementById("passwordInput").value;
    const file = document.getElementById("fileInput").files[0];

    if (!password || !file) {
      alert("Please enter a password and select a file.");
      return;
    }


    console.log("Password:", password);
    console.log("File name:", file.name);

    toggleModal(); // Close modal after submission
  }

// fetch('/names.csv')
//   .then(response => response.text())
//   .then(csvText => {
//     Papa.parse(csvText, {
//       header: true,
//       skipEmptyLines: true,
//       complete: function(results) {
//           reference = results.data.map(row => ({
//           name: `${row['First']} ${row['Last']}`,
//           ID: parseInt(row['ID']),
//           status: row['Status'].trim().toLowerCase()
//         }));

//         // For testing purposes: console.log("Reference:", reference);
//         // To access a student name based on ID: console.log("Student: " + reference.find(Object => Object.ID === 12345678)['name']);
    
//     }
//     });
//   });

function saveData(student) {
  const data = new FormData();
  data.append('Name', student["name"]);
  data.append('Status', student["status"]);
  data.append('ID', student["ID"]);
  fetch(scriptURL, {
    method: 'POST',
    body: data
  })
  .catch(error => console.error('Error!', error.message));
}

// executed every time the input box changes
function idEnter(){
    const idEntered = document.getElementById("idnum").value;
    const student = reference.find(obj => obj.ID == parseInt(idEntered));
    if(idEntered.length == 8 && student) {
        document.getElementById("error").classList.add("hidden");
    
        document.getElementById("name").innerHTML = student["name"] + " | ";
        document.getElementById("time").innerHTML = " | " + new Date().toLocaleString();
        document.getElementById("idnum").value = ""; // Clear the input field after 

        if(student["status"] == "in") {
            student["status"] = "out";
        }
        else {
            student["status"] = "in";
        }
        
        if(student["status"] == "in") {
            document.getElementById("status-in").classList.remove("hidden");
            document.getElementById("status-out").classList.add("hidden");
            document.getElementById("checked").classList.remove("hidden");
        } 

        else {
            document.getElementById("status-in").classList.add("hidden");
            document.getElementById("status-out").classList.remove("hidden");
            document.getElementById("checked").classList.remove("hidden");
        }

        saveData(student);

    }

    else {
        document.getElementById("error").classList.remove("hidden");
        document.getElementById("checked").classList.add("hidden");
        document.getElementById("status-in").classList.add("hidden");
        document.getElementById("status-out").classList.add("hidden");
        document.getElementById("name").innerHTML = "";
        document.getElementById("time").innerHTML = "";

    }
}

