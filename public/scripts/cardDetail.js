async function fetchOrganizationDetails(orgName) {
  var orgDetails;
  try {
    const response = await fetch(`/organizations?name=${encodeURIComponent(orgName)}`);
    orgDetails = await response.json();
    console.log(orgDetails);
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw error; 
  }
  console.log(orgDetails);
}

document.addEventListener("DOMContentLoaded", function() {
  // Retrieve the organization name from the URL
  var orgName = decodeURIComponent(new URLSearchParams(window.location.search).get("name"));

  fetchOrganizationDetails(orgName);
});
