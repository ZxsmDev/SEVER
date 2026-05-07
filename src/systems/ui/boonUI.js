export default class BoonUI {
  constructor(list) {
    this.list = list;
    this.active = true;
  }
  render() {
    const parent = document.getElementById("ui");

    const child = `
      <section id="boon-ui">
        <h1>Select a Boon:</h1>
        <ul>
          ${this.list
            .map(
              (boon) => `
            <button id="boon-btn">
              <h2>${boon.name}</h2>
              <p>${boon.description}</p>
            </button>
          `,
            )
            .join("")}
        </ul>
      </section>
      `;

    parent.innerHTML = child;
  }
  update() {
    if (!active) return;
    const btns = document.querySelectorAll("#boon-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.firstChild().innerHTML;
        const index = this.list.name.indexOf(name);
        if (this.list[index].available) {
          this.list[index].apply();
          this.active = false;
        }
      });
    });
  }
}
