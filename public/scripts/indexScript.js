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


async function fetchData() {
    try {
        const response = await fetch('/organizations');
        const data = await response.json();
        generateCards(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


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


    var organizationsData;
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


    const filteredData = organizationsData.filter(org => {
        return (
            (!category || org.category === category) &&
            (selectedYears.every(selectedYear => org.years[selectedYear])) &&
            (!technology || org.technologies.includes(technology)) &&
            (!topic || org.topics.includes(topic))
        );
    });
    
    generateCards(filteredData);
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

        var technologies = document.createElement("p");
        technologies.innerHTML = "<strong>Technologies:</strong> " + orgData.technologies.slice(0, 5).join(", ");
        cardContent.appendChild(technologies);

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