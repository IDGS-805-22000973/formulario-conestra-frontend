class BotonRegresar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button
        style="
          background-color: #0d6efd;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        "
      >
        Regresar
      </button>
    `;

    const button = this.querySelector("button");
    button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("regresar", { bubbles: true }));
    });
  }
}

if (!customElements.get("boton-regresar")) {
  customElements.define("boton-regresar", BotonRegresar);
}
