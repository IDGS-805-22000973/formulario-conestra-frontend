import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/Logo2.png";

const addProfessionalHeader = (doc, title) => {
    // Fondo de encabezado con color profesional
    doc.setFillColor(25, 40, 120); // Azul oscuro profesional
    doc.rect(0, 0, 210, 35, "F");

    // Logo
    doc.addImage(Logo, "PNG", 14, 8, 20, 20);

    // Título
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 100, 20);

    // Línea divisoria
    doc.setDrawColor(25, 40, 120);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
};

export const descargarResultadosMossPDF = (usuario, resultados) => {
    const doc = new jsPDF();

    // Agregar encabezado profesional
    addProfessionalHeader(doc, "Resultados Test MOSS");

    // Información del usuario
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(25, 40, 120);
    doc.text("INFORMACIÓN DEL USUARIO", 14, 50);
    
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Usuario: ${usuario?.nombre || "N/A"}`, 14, 58);
    doc.text(`Correo: ${usuario?.correo || "N/A"}`, 14, 64);
    doc.text(`Total de aciertos: ${resultados?.totalAciertos ?? "N/A"}`, 14, 70);

    const areas = resultados?.areas || {};

    const filas = Object.entries(areas).map(([area, data]) => [
        area,
        data?.rango ?? "N/A",
        data?.puntaje ?? "N/A",
        data?.percentil != null ? `${data.percentil}%` : "N/A",
    ]);

    autoTable(doc, {
        startY: 80,
        head: [["Área", "Rango", "Puntaje", "Percentil"]],
        headStyles: {
            fillColor: [25, 40, 120],
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            fontSize: 9,
            textColor: 0,
            halign: "center",
        },
        alternateRowStyles: {
            fillColor: [240, 245, 250],
        },
        margin: { left: 14, right: 14 },
        columnStyles: { 0: { halign: "left" } },
    });

    doc.save(`Resultados_MOSS_${usuario?.nombre || "usuario"}.pdf`);
};

export const descargarResultados16PFPDF = (usuario, resultados) => {
    const doc = new jsPDF();

    // Agregar encabezado profesional
    addProfessionalHeader(doc, "Resultados Test 16PF");

    // Información del usuario
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(25, 40, 120);
    doc.text("INFORMACIÓN DEL USUARIO", 14, 50);
    
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Usuario: ${usuario?.nombre || "N/A"}`, 14, 58);
    doc.text(`Correo: ${usuario?.correo || "N/A"}`, 14, 64);

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
        startY: 75,
        head: [["Factor", "Decatipo", "Puntaje Bruto"]],
        headStyles: {
            fillColor: [25, 40, 120],
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            fontSize: 9,
            textColor: 0,
            halign: "center",
        },
        alternateRowStyles: {
            fillColor: [240, 245, 250],
        },
        margin: { left: 14, right: 14 },
        columnStyles: { 0: { halign: "left" } },
    });

    doc.save(`Resultados_16PF_${usuario?.nombre || "usuario"}.pdf`);
};
