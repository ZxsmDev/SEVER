export default class BoonUI {
  render(list) {
    const parent = document.getElementById("ui");

    const child = `
      <section id="boon-ui">
        <h1>Boon</h1>
        <ul>
          ${list
            .map(
              (boon) => `
            <button>
              <h2>${boon.name}</h2>
              <p>${boon.description}</p>
            </button>
          `
            )
            .join("")}
        </ul>
      </section>
      `;

    parent.innerHTML = child;
  }
}
