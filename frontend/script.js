document.addEventListener("DOMContentLoaded", (e) => {
  renderMedicineList();
  fetchAveragePrice();
  radioEventListener();
  addFormEventListeners();
});

const renderMedicineList = () => {
  const listCont = document.getElementById("med-list");

  fetch("http://0.0.0.0:8000/medicines")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error fetching medicines from server");
      }
      return res.json();
    })
    .then((data) => {
      Object.entries(data["medicines"]).forEach(([key, med]) => {
        const medRow = document.createElement("tr");
        medRow.classList.add("medicine__item");

        const idCont = document.createElement("td");
        idCont.textContent = key;

        const nameCont = document.createElement("td");
        nameCont.textContent =
          med["name"] !== "" && med["name"] !== null ? med["name"] : "N / A";

        const priceCont = document.createElement("td");
        priceCont.textContent =
          med["price"] !== "" && med["price"] !== null ? med["price"] : "N / A";

        medRow.appendChild(idCont);
        medRow.appendChild(nameCont);
        medRow.appendChild(priceCont);

        listCont.appendChild(medRow);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const radioEventListener = () => {
  const editOptions = document.querySelectorAll(
    "input[type='radio'][name='edit_med']"
  );

  editOptions.forEach((opt) => {
    opt.addEventListener("change", (e) => {
      e.preventDefault();
      switch (opt.value) {
        case "create":
          document.getElementById("form_create").classList.remove("hidden");
          document.getElementById("form_update").classList.add("hidden");
          document.getElementById("form_del").classList.add("hidden");
          break;
        case "update":
          document.getElementById("form_update").classList.remove("hidden");
          document.getElementById("form_create").classList.add("hidden");
          document.getElementById("form_del").classList.add("hidden");
          break;
        case "del":
          document.getElementById("form_del").classList.remove("hidden");
          document.getElementById("form_create").classList.add("hidden");
          document.getElementById("form_update").classList.add("hidden");
          break;
      }
    });
  });
};

const addFormEventListeners = () => {
  document
    .getElementById("form_create")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      try {
        const response = await fetch("http://0.0.0.0:8000/create", {
          method: "POST",
          body: new URLSearchParams({
            name: formData.get("med_name").toLowerCase(),
            price: formData.get("med_price"),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Medicine created successfully.", data);
        }
      } catch (err) {
        alert("Error getting response", err);
        console.log(err);
      }
    });

  document
    .getElementById("form_update")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      try {
        const response = await fetch("http://0.0.0.0:8000/update", {
          method: "POST",
          body: new URLSearchParams({
            name: formData.get("med_name").toLowerCase(),
            price: formData.get("med_price"),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Medicine updated successfully.", data);
        }
      } catch (err) {
        alert("Error getting response", err);
        console.log(err);
      }
    });

  document.getElementById("form_del").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("http://0.0.0.0:8000/delete", {
        method: "DELETE",
        body: new URLSearchParams({
          name: formData.get("med_name").toLowerCase(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Medicine deleted successfully.", data);
      }
    } catch (err) {
      alert("Error getting response", err);
      console.log(err);
    }
  });
};

const fetchAveragePrice = async () => {
  const avgCont = document.getElementById("average__container");
  avgCont.textContent = "Fetching average...";

  const response = await fetch("http://0.0.0.0:8000/get_average_price", {
    method: "POST",
  });

  if (!response.ok) {
    console.error("Error fetching average price.");
    return;
  }

  const data = await response.json();

  avgCont.textContent =
    data["average"] !== "" ? "£" + data["average"] : "N / A";
};