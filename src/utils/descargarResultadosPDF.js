import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const descargarResultadosMossPDF = (usuario, resultados) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Resultados Test MOSS", 14, 15);

    doc.setFontSize(11);
    doc.text(`Usuario: ${usuario?.nombre || "N/A"}`, 14, 25);
    doc.text(`Correo: ${usuario?.correo || "N/A"}`, 14, 32);
    doc.text(`Total de aciertos: ${resultados?.totalAciertos ?? "N/A"}`, 14, 39);

    const areas = resultados?.areas || {};

    const filas = Object.entries(areas).map(([area, data]) => [
        area,
        data?.rango ?? "N/A",
        data?.puntaje ?? "N/A",
        data?.percentil != null ? `${data.percentil}%` : "N/A",
    ]);

    autoTable(doc, {
        startY: 50,
        head: [["Área", "Rango", "Puntaje", "Percentil"]],
        body: filas,
    });

    doc.save(`Resultados_MOSS_${usuario?.nombre || "usuario"}.pdf`);
};

export const descargarResultados16PFPDF = (usuario, resultados) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Resultados Test 16PF", 14, 15);

    doc.setFontSize(11);
    doc.text(`Usuario: ${usuario?.nombre || "N/A"}`, 14, 25);
    doc.text(`Correo: ${usuario?.correo || "N/A"}`, 14, 32);

    const decatipos = resultados?.decatipos || {};
    const puntajesBrutos = resultados?.puntajesBrutos || {};

    // Construimos tabla combinada
    const factores = Object.keys(decatipos);

    const filas = factores.map((factor) => [
        factor,
        decatipos[factor] ?? "N/A",
        puntajesBrutos[factor] ?? "N/A",
    ]);

    autoTable(doc, {
        startY: 45,
        head: [["Factor", "Decatipo", "Puntaje Bruto"]],
        body: filas,
        styles: { fontSize: 10 },
    });

    doc.save(`Resultados_16PF_${usuario?.nombre || "usuario"}.pdf`);
};
