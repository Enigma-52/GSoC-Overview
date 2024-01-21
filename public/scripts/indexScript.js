$("#technologyFilter").select2({
    placeholder: "Select a Technology",
    allowClear: true
});

$("#categoryFilter").select2({
    placeholder: "Select a Category",
    allowClear: true
});

$("#topicFilter").select2({
    placeholder: "Select a Topic",
    allowClear: true
});

$("#yearFilter").select2({
    placeholder: "Select Year",
    allowClear: true
});

let organizationsData;
// creating a global variable to store the data fetched from the server
// this way we can avoid making multiple unbncessary requests to the server ... 

async function fetchAllData() {
    try {
        const response = await fetch('/organizations');
        organizationsData = await response.json();
        generateCards(organizationsData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchByName(name) {
      // converting the name and organizations response to lowercase server-side to make the search case-insensitive, 
      // if not, search returns an error 👍 --- 
      // also we should be fine with a partial match (.includes()) --- should be okay, yeah?!
    try {
       const lowercaseName = name.toLowerCase();
       const matchingOrgs = organizationsData.filter(org => org.name.toLowerCase().includes(lowercaseName));
       if (matchingOrgs.length > 0) {
        // if there are matching organizations, generate cards:
        generateCards(matchingOrgs);
        clearErrorMessage(); // clear any existing error message, in case previously displayed
        } else {
            return displayErrorMessage(`Organization "${name}" not found.`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayErrorMessage(message) {
    const errorMessageContainer = document.getElementById("error-message");
    errorMessageContainer.textContent = message;
}

function clearErrorMessage() {
    const errorMessageContainer = document.getElementById("error-message");
    errorMessageContainer.textContent = '';
}

const nameSearchInput = document.getElementById("nameSearch");
nameSearchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // Call applyFilters when Enter is pressed -- to ease searching by name
        applyFilters();
    }
});



async function addToDropdown(filterId, property) {
    try {
        const response = await fetch('/organizations');
        organizationsData = await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    const filterSelect = document.getElementById(filterId);

    const uniqueValues = [...new Set(organizationsData.flatMap(org => org[property]))];
    if (property == "category") {
        console.log(uniqueValues);
    }

    uniqueValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        filterSelect.appendChild(option);
    });
}


addToDropdown('categoryFilter', 'category');
addToDropdown('technologyFilter', 'technologies');
addToDropdown('topicFilter', 'topics');



async function applyFilters() {

    try {
        const response = await fetch('/organizations');
        organizationsData = await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    const category = document.getElementById("categoryFilter").value;
    const yearSelect = document.getElementById("yearFilter");
    const selectedYears = Array.from(yearSelect.selectedOptions).map(option => option.value);
    const technology = document.getElementById("technologyFilter").value;
    const topic = document.getElementById("topicFilter").value;
    const nameSearch = document.getElementById("nameSearch").value.toLowerCase();


    const filteredData = organizationsData.filter(org => {
        return (
            (!category || org.category === category) &&
            (selectedYears.every(selectedYear => org.years[selectedYear])) &&
            (!technology || org.technologies.includes(technology)) &&
            (!topic || org.topics.includes(topic))
        );
    });
    organizationsData = filteredData;
    
    generateCards(filteredData);
    if (nameSearch) {
        fetchByName(nameSearch);
    } else {
        console.log('Name is empty or undefined. Not calling fetchByName.');
    }    
    console.log(organizationsData);
    console.log("sent data");
    console.log(filteredData);
}

function generateCards(organizationsData) {
    var cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    organizationsData.forEach(function(orgData) {

        var card = document.createElement("div");

        var imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        var image = document.createElement("img");
        image.src = orgData.image_url;
        image.style.backgroundColor = orgData.image_background_color;
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        var cardContent = document.createElement("div");
        cardContent.className = "card-content";
        var heading = document.createElement("h4");
        heading.textContent = orgData.name;
        cardContent.appendChild(heading);

        var categoryColorsMap = new Map([
            ["Science and medicine", "#ff9999"],
            ["Security", "#ccffcc"],
            ["End user applications", "#ffcc99"],
            ["Programming languages", "#ffccff"],
            ["Media", "#99ccff"],
            ["Operating systems", "#ffcc00"],
            ["Other", "#d9d9d9"],
            ["Infrastructure and cloud", "#99ff99"],
            ["Data", "#ffb366"],
            ["Web", "#66b3ff"],
            ["Social and communication", "#ff6666"],
            ["Development tools", "#c2f0c2"]
        ]);


        var topicsTech = document.createElement("div");
        var categoryBox = document.createElement("div");
        categoryBox.className = "btn-wrapper";
        var category = document.createElement("button");
        category.className = "btn";
        category.textContent = orgData.category;
        var categoryColor = categoryColorsMap.get(orgData.category) || "cyan";
        category.style.border = "1px solid " + categoryColor;
        category.style.backgroundColor = categoryColor;
        categoryBox.appendChild(category);
        topicsTech.appendChild(categoryBox);

        var description = document.createElement("p");
        description.textContent = orgData.description;
        cardContent.appendChild(topicsTech);
        cardContent.appendChild(description);

        if(orgData.technologies){
            var technologies = document.createElement("p");
            technologies.innerHTML = "<strong>Technologies:</strong> " + orgData.technologies.slice(0, 5).join(", ");
            cardContent.appendChild(technologies);
        }

        var yearsContent = document.createElement("div");
        yearsContent.className = "years-content";

        var yearsList = document.createElement("p");
        yearsList.innerHTML = "<strong>Years:</strong> " + Object.keys(orgData.years).join(", ");
        yearsContent.appendChild(yearsList);

        cardContent.appendChild(yearsContent);


        card.appendChild(imageContainer);
        card.appendChild(cardContent);

        var cardLink = document.createElement("a");
        cardLink.href = "cardDetail.html?name=" + encodeURIComponent(orgData.name);
        cardLink.className = "card-link";

        cardLink.appendChild(card); // Append the card to the link

        cardsContainer.appendChild(cardLink);

    });
}


let flag = false;

async function startupFunction() {
    applyFilters(flag);
    flag = true;
}

if (!flag) {
    startupFunction();
}

document.addEventListener("DOMContentLoaded", function() {
    nameSearchInput.value = ""
  });