// API_URL
const API_URL =
  'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events';

const state = {
  parties: [],
};

const partiesList = document.querySelector('#partiesList');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', partyPush);

const error = 'No Parties Available!';

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    // state.parties = Array.isArray(json) ? json : [];
    state.parties = json.data;
  } catch (error) {
    alert(error);
  }
}

// function to render the list of parties
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML = `<li>No Parties Found!</li>`;
    return;
  }
  // partiesList.innerHTML = ''; // clears the list
  state.parties.forEach((party) => {
    const partyRow = document.createElement('li');
    partyRow.classList.add('party');
    partyRow.innerHTML = `
      <div>
        <strong>${party.name}</strong>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}<p>
      </div>
      <button class="delete">Delete</button>
    `;
    partyRow.appendChild(createDeleteButton(party));
    partiesList.appendChild(partyRow);
    return partyRow;
  });
  partiesList.replaceChildren(...partiesList);
}

// function to create a delete button
function createDeleteButton(party) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';

  // Add a click event listener to handle deletion
  deleteButton.addEventListener('click', async () => {
    await deleteParty(party); // Assuming there's a deleteParty function
  });

  return deleteButton;
}

// function to fetch and render the parties
async function render() {
  await getParties();
  renderParties();
  await updatePartyList();
}
render();

// function to create a new party
async function addParty(name, date, location, description) {
  try {
    const isoDate = new Date(date + ':00').toISOString();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, date: isoDate, location, description }),
    });
    const json = await response.json();
    console.log('Response', json);
    if (json.error) {
      throw new Error(json.error);
    }
    state.parties.push(json);
  } catch (error) {
    alert(error);
  }
  render();
}

// async function with the event handler with .addEventListner call
async function partyPush(event) {
  event.preventDefault();
  await addParty(
    addPartyForm.name.value,
    addPartyForm.date.value,
    addPartyForm.location.value,
    addPartyForm.description.value
  );
  addPartyForm.name.value = '';
  addPartyForm.date.value = '';
  addPartyForm.location.value = '';
  addPartyForm.description.value = '';
}

//function to update existing parties list
async function updatePartyList(id, name, date, location, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    render();
  } catch (error) {
    alert(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    render();
  } catch (error) {
    alert(error);
  }
}
