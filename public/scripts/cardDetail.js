document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the organization name from the URL
    var orgName = decodeURIComponent(new URLSearchParams(window.location.search).get("name"));
  
    // Update the DOM with the organization name
    var orgNameElement = document.getElementById("orgName");
    if (orgNameElement) {
      orgNameElement.textContent = orgName;
    }
  
    // Use orgName to fetch the specific organization details from the server
    // (Add your code to fetch and update other details if needed)
  });
  