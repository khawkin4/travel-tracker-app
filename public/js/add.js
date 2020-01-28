const locationForm = document.getElementById("location-form");
const locationAddress = document.getElementById("location-address");
const locationDate = document.getElementById("location-date");

async function addLocation(e) {
  e.preventDefault();

  if (locationAddress === "" || locationDate === "") {
    alert("Please fill in all fields");
  }

  const sendBody = {
    address: locationAddress.value,
    dateVisited: locationDate.value
  };

  try {
    const res = await fetch("/api/v1/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sendBody)
    });

    if (res.status === 400) {
      throw Error("Store already exists!");
    }

    alert("Store added!");
    console.log(sendBody);
  } catch (error) {
    alert(err);
    return;
  }
}

locationForm.addEventListener("submit", addLocation);
