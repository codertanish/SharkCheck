const idDigits = 8 // Number of digits present in ID.
let reference = [];
let scriptURL = "";
let password = "";
let csvFile;

  fetch('/config')
  .then(res => res.json())
  .then(data => {
    scriptURL = data.scriptURL;
    password = data.password;
  });


  function toggleUpload() {
    const modal = document.getElementById("popupModal");
    modal.classList.toggle("hidden");
    document.getElementById("passwordInput").value = "";
    document.getElementById("fileInput").value = "";
    document.getElementById("fileName").innerHTML = "";
  }

  function submitUpload() {
    csvFile = document.getElementById("fileInput").files[0];
    input = document.getElementById("passwordInput").value;

    if (input!=password || !csvFile) {
      alert("Incorrect Password/File not Selected. Please retry.");
      return;
    }

    if(input==password && csvFile) {
          Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
       reference = results.data.map(row => ({
        name: `${row['First']} ${row['Last']}`,
        ID: parseInt(row['ID']),
        status: row['Status'].trim().toLowerCase()
      }));

    }
  });
        alert("CSV Sucessfully Saved and Parsed!");
    }

    toggleUpload();

  }

function saveData(student) {
  const data = new FormData();
  data.append('Name', student["name"]);
  data.append('Status', student["status"]);
  data.append('ID', student["ID"]);
  data.append('action', 'submit')
  fetch(scriptURL, {
    method: 'POST',
    body: data
  })
  .catch(error => console.error('Error!', error.message));
}

function resetData() {
  const data = new FormData();
  data.append('action', 'reset')
  fetch(scriptURL, {
  method: 'POST',
  body: data
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Error:', err));
}

  function confirmReset() {
    if(document.getElementById("resetPassword").value !== password) {
      document.getElementById("passwordError").innerHTML = "Incorrect password.";
      document.getElementById("passwordError").classList.remove("hidden");
      document.getElementById("resetPassword").value = "";
      return;
    }
    else {
      resetData();
      document.getElementById("passwordError").classList.remove("hidden")
      document.getElementById("passwordError").innerHTML = "Data reset successfully; you may now close this window.";
      document.getElementById("resetPassword").value = "";
    }

  }

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

