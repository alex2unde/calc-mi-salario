export function registrarDescargaPDF() {
  const botonDescarga = document.getElementById("botonPDF");
  botonDescarga.addEventListener("click", async () => {
    const capturaAqui = document.getElementById("divPDF");

    if (!capturaAqui) {
      alert("Primero debes realizar el cálculo para generar el PDF.");
      return;
    }

    if (!(await window.html2pdfReady)) {
      alert(
        "No se pudo cargar el generador de PDF. Revisá tu conexión e intentá nuevamente.",
      );
      return;
    }

    capturaAqui.classList.add("forzar-PDF");

    const configPDF = {
      margin: 5,
      filename: "sueldo-calculado.pdf",
      image: { type: "jpeg", quality: 0.98 },
      pagebreak: { mode: ["css", "legacy"] },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        ignoreElements: (element) => element.classList.contains("no-pdf"),
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    window
      .html2pdf()
      .set(configPDF)
      .from(capturaAqui)
      .save()
      .then(() => {
        capturaAqui.classList.remove("forzar-PDF");
      });
  });
}
