import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/Logo2.png";

// ─────────────────────────────────────────────────────────────────────────────
// COLORES Y CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_NAVY = [15, 33, 84];   // #0f2154
const COLOR_WHITE = [255, 255, 255];
const COLOR_BLACK = [30, 41, 59];
const COLOR_GRAY = [71, 85, 105];
const COLOR_PALE = [239, 246, 255]; // azul muy suave para fondo de bloques
const COLOR_BORDER = [203, 213, 225]; // borde gris suave

// ─────────────────────────────────────────────────────────────────────────────
// INTERPRETACIONES MOSS
// ─────────────────────────────────────────────────────────────────────────────
const MOSS_DESC =
    "Mide la adaptabilidad y capacidad de la persona en la toma de decisiones, sensatas y lógicas para la solución de problemas en un rango de: supervisión, jefaturas, gerencias y coordinación.";

const MOSS_INTERPRETACIONES = {
    supervision: {
        label: "1. Habilidad en la Supervisión",
        desc: "Eficacia con que propicia que el personal a su cargo cumpla con las actividades encomendadas.",
        niveles: {
            "Inferior": "Bajo nivel en propiciar la eficacia con el personal que tiene a su cargo, para que este cumpla con las actividades encomendadas.",
            "Medio Inferior": "Cuenta con la capacidad de eficacia, sin embargo, le cuesta establecer estándares para propiciarla con el personal que tiene a su cargo, para que este cumpla con las actividades encomendadas.",
            "Medio": "Habilidad para propiciar la eficacia con el personal a su cargo, para que este cumpla con las actividades encomendadas.",
            "Medio Superior": "Amplia capacidad para propiciar la eficacia con el personal a su cargo, para cumplir con las actividades encomendadas.",
            "Muy Superior": "Excelente capacidad en propiciar la eficacia con el personal a su cargo, para que este cumpla con las actividades encomendadas.",
        },
    },
    decision: {
        label: "2. Capacidad de Decisión en las Relaciones Humanas",
        desc: "Criterio y toma de decisiones con respecto a la forma de interactuar con los demás.",
        niveles: {
            "Inferior": "Bajo criterio en la toma de decisiones con respecto a la forma de interactuar con los demás.",
            "Medio Inferior": "Cuenta con la capacidad, sin embargo, le cuesta establecer criterio en la toma de decisiones con respecto a la forma de interactuar con los demás.",
            "Medio": "Habilidad de criterio en la toma de decisiones con respecto a la forma de interactuar con los demás.",
            "Medio Superior": "Amplia capacidad de criterio en la toma de decisiones con respecto a la forma de interactuar con los demás.",
            "Muy Superior": "Excelente capacidad de criterio en la toma de decisiones con respecto a la forma de interactuar con los demás.",
        },
    },
    evaluacion: {
        label: "3. Capacidad para Evaluar Problemas Interpersonales",
        desc: "Criterio y juicio con respecto a situaciones sociales que presentan conflicto con cierta problemática.",
        niveles: {
            "Inferior": "Bajo criterio y juicio con respecto a situaciones sociales que presentan conflicto con cierta problemática.",
            "Medio Inferior": "Cuenta con la capacidad, sin embargo, le cuesta establecer criterio y juicio con respecto a situaciones sociales que presentan conflicto con cierta problemática.",
            "Medio": "Buena capacidad de criterio y juicio con respecto a situaciones sociales que presentan conflicto con cierta problemática.",
            "Medio Superior": "Amplia capacidad de criterio y juicio, respecto a situaciones sociales que presentan conflicto con cierta problemática.",
            "Muy Superior": "Excelente criterio y juicio, respecto a situaciones sociales que presentan conflicto con cierta problemática.",
        },
    },
    relaciones: {
        label: "4. Capacidad para Establecer Relaciones Interpersonales",
        desc: "Facultad para establecer contacto con los demás de manera adaptativa y eficiente.",
        niveles: {
            "Inferior": "Bajo criterio para establecer contacto con los demás de manera adaptativa y eficiente.",
            "Medio Inferior": "Cuenta con la capacidad, sin embargo, le cuesta establecer contacto con los demás de manera adaptativa y eficiente.",
            "Medio": "Buena capacidad de criterio para establecer contacto con los demás de manera adaptativa y eficiente.",
            "Medio Superior": "Amplia capacidad de criterio para establecer contacto con los demás de manera adaptativa y eficiente.",
            "Muy Superior": "Excelente capacidad de criterio para establecer contacto con los demás de manera adaptativa y eficiente.",
        },
    },
    sentidoComun: {
        label: "5. Sentido Común y Tacto en las Relaciones Interpersonales",
        desc: "Capacidad de llevarse bien con los demás manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
        niveles: {
            "Inferior": "Baja capacidad de llevarse bien con los demás manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
            "Medio Inferior": "Cuenta con la capacidad, sin embargo, le cuesta llevarse bien con los demás, manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
            "Medio": "Cuenta con la capacidad de llevarse bien con los demás manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
            "Medio Superior": "Amplia capacidad de llevarse bien con los demás manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
            "Muy Superior": "Excelente capacidad de llevarse bien con los demás manteniendo una conducta basada en el buen juicio y la lógica ante dificultades o conflictos.",
        },
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERPRETACIONES 16PF  (M = Masculino, F = Femenino)
// (+) decatipo 8-10  |  (-) decatipo 1-3  |  rango 4-7 = sin bloque extremo
// ─────────────────────────────────────────────────────────────────────────────
const PF16_DESC =
    "Mide rasgos de personalidad del individuo, describe y predice el posible comportamiento en una variedad de contextos: personal, familiar, social y laboral.";

const PF16_INTERPRETACIONES = {
    M: {
        A: {
            label: "A — Cordialidad",
            plus: "Cortés, afectivo en el trato a los demás, cálido, gentil, atento a los demás, simpático, colaborador, adaptable, amable, emocionalmente expresivo, de buen genio, se siente confortable en situaciones de cercanía personal.",
            minus: "Frío, impersonal, distante, rígido, centrado en las cosas, crítico, tiene bajo nivel de empatía, es inflexible, desconfiado, cerrado, egoísta y poco afectuoso. Suele ser reservado, le gusta el trabajo en solitario. Óptimo para el manejo de computadoras, área contable o programador.",
        },
        B: {
            label: "B — Razonamiento",
            plus: "Inteligente, gran capacidad para entender, pensar y manejar información. Tiende a ser rápido en la comprensión de las ideas, de pensamiento lógico analítico, ágil para reconocer la solución de un problema, creativo y perseverante.",
            minus: "De pensamiento concreto, lentitud para captar y analizar, falta de criterio, se da por vencido fácilmente, deficiencia en su aprendizaje. Puede presentar bajo rendimiento laboral. Suele tener deficiencia en la comprensión e interpretación o falta de atención.",
        },
        C: {
            label: "C — Estabilidad",
            plus: "Gestiona sus emociones de forma positiva, emocionalmente estable, tiende a tomar decisiones asertivas, adaptado, maduro, con alto nivel de tolerancia a la frustración, responsable, alto nivel de energía, culmina proyectos y es constante en sus intereses.",
            minus: "Bajo nivel de estabilidad emocional, se frustra fácilmente, negativo, se victimiza, evade responsabilidades, con resentimiento hacia los demás, voluble, neurótico, tiende a darse por vencido, tiene falta de control sobre su vida y altibajos de humor.",
        },
        E: {
            label: "E — Dominancia",
            plus: "Asertivo, competitivo, rebelde, poco convencional, obstinado, de ideas posesivas, fuerte, le gusta que lo alaben, adecuado para emergencias o situaciones críticas, seguro de sí mismo, de mentalidad independiente, le gusta tener el control, tiende a pensar que siempre tienen la razón.",
            minus: "Acomedido, cooperativo, evita los conflictos, manejable, humilde, convencional, conformista, sumiso, inseguro, dócil y servicial. En el ámbito laboral prefiere ser supervisado y se le dirija.",
        },
        F: {
            label: "F — Animación",
            plus: "Entusiasta, animoso, espontáneo, activo, impulsivo, franco, expresivo. Se le acoge como líder electo, alto nivel de energía.",
            minus: "Serio, reprimido, soberbio, prudente, rígido, introspectivo, precavido, lento, reflexivo, pesimista, presumido, cauteloso, se apega a sus valores personales, callado, no es dado a la diversión.",
        },
        G: {
            label: "G — Atención a las Normas",
            plus: "Atento a las normas, cumplido, formal, disciplinado, estable, de carácter exigente, responsable, organizado, dominado por el sentido del deber, perseverante, constante. Seguidor de las reglas, los principios y los buenos modales, necesita de poca supervisión. Antes de tomar una decisión analiza cuidadosamente en lo correcto y justo.",
            minus: "Inconformista, indulgente, despreocupado, acepta pocas obligaciones, suele ser inestable en sus propósitos, libre, voluble, frívolo, indulgente consigo mismo, falta de atención al compromiso personal y laboral, hace lo que quiere, se guía por sus impulsos, suele no tener normas. Podría sembrar a su alrededor el desorden y el desaliño.",
        },
        H: {
            label: "H — Atrevimiento",
            plus: "Atrevido, sin temor a cosas nuevas, seguro en lo social, emprendedor, espontáneo, sociable, abierto, dispuesto a intentar nuevas cosas. Cuenta con la capacidad para el manejo de clientes. Soporta situaciones sociales abrumadoras. Extrovertido en ambientes nuevos. Óptimo para ser: vendedor, líder, gerente, relaciones públicas.",
            minus: "Tímido, temeroso, cohibido, reprimido, falta de confianza en sí mismo, baja autoeficacia, cauteloso, retraído, lento y torpe para hablar. Le resulta difícil hablar frente a un grupo de gente, puede representar bajo nivel de autoestima. Se intimida fácilmente. Óptimo para ser: auxiliar contable, sistemas, supervisor.",
        },
        I: {
            label: "I — Sensibilidad",
            plus: "Sensible, sentimental, demandante de atención y afecto, suele dejarse afectar por sus sentimientos, idealista, soñador, impaciente, suele ser dependiente, poco práctico e inseguro.",
            minus: "Objetivo, nada sentimental, autoritario, sensibilidad dura, confiado en sí mismo, realista, práctico, independiente, responsable, emocionalmente maduro, mantiene al grupo trabajando sobre bases realistas acertadas, insensible, actúa basado en evidencias prácticas y lógicas.",
        },
        L: {
            label: "L — Vigilancia",
            plus: "Desconfiado, precavido, vigilante, está pendiente de caerle bien a las personas, rencoroso, generador de conflictos, actúa con premeditación. Pésimo para el grupo, suele dañar el clima. Óptimo para ser vigilante.",
            minus: "Confiado, sin sospechas, adaptable al cambio, no suele presentar tendencia a los celos o envidia, animado, poco competitivo, buen colaborador de grupo, no rencoroso, cree en la gente, tranquilo en las relaciones interpersonales, tiende a ver lo bueno de todo, no suele ser conflictivo.",
        },
        M: {
            label: "M — Abstracción",
            plus: "Abstraído, imaginativo, idealista, centrado en sus necesidades íntimas, poco convencional, despreocupado de lo cotidiano. Sus intereses se dirigen hacia su intimidad, se siente excluido de las actividades de grupo. Ideal para cargos de planeación, asesorías.",
            minus: "Práctico, con los pies en la tierra, realista, cuidadoso, convencional, ansioso por hacer las cosas correctamente, preocupado por los detalles, capaz de serenidad en las situaciones de emergencia, poco imaginativo, centrado, cuidadoso e interesado. Motivado por resultados inmediatos, evita metas lejanas y confía en juicios prácticos. Óptimo para trabajo de oficina.",
        },
        N: {
            label: "N — Privacidad",
            plus: "Privado, astuto, perspicaz, calculador, discreto, cuidadoso de no hacer daño, maneja su imagen, piensa lo que dice, respetuoso del otro, ambicioso, se guarda sus problemas. Con enfoque intelectual y poco sentimental, planeador de sus actos. Óptimo para el área financiera y servicios.",
            minus: "Abierto, genuino, natural, sencillo, sentimental, poco sofisticado, espontáneo, poco refinado, torpe, ordinario, de mente imprecisa, poco juicioso, poco hábil para analizar motivos y se conforma con lo que encuentra. Hace y dice las cosas sin pensar en sus consecuencias, ingenuo, suele ser auténtico.",
        },
        O: {
            label: "O — Aprensión",
            plus: "Inseguro, autocrítico y preocupado. Suele ser aprensivo en su forma de laborar, tiende a no dejar pendientes de trabajo.",
            minus: "Seguro, despreocupado, alta autoestima y autoeficacia, maduro, poco ansioso, sin temores, entregado a la acción espontánea, alegre, sereno, tranquilo, soporta la presión. Puede generar bajo rendimiento laboral.",
        },
        Q1: {
            label: "Q1 — Apertura al Cambio",
            plus: "De mente abierta y dispuesto al cambio, tiende a ser liberal, con rechazo a lo tradicional y convencional. Suele avanzar en dirección hacia sus metas y objetivos.",
            minus: "Tradicional, apegado a lo familiar, conservador, moderado, no imaginativo, conformista, satisfecho de sí y de todo, respetuoso de las ideas establecidas, tolerante de los defectos tradicionales.",
        },
        Q2: {
            label: "Q2 — Autosuficiencia",
            plus: "Individualista, autosuficiente, lleno de recursos, prefiere tomar sus propias decisiones y trabajar solo, suele ser independiente. Sigue su propio camino, no necesita el apoyo de otras personas, es introvertido y el grupo no lo presiona fácilmente.",
            minus: "Seguidor, buen compañero, se integra en el grupo con facilidad, dependiente, prefiere trabajar y tomar decisiones con los demás, indeciso, depende de la aprobación social, puede ser negativo ya que se deja influenciar.",
        },
        Q3: {
            label: "Q3 — Perfeccionismo",
            plus: "Perfeccionista, organizado, disciplinado, socialmente adaptado, abierto a lo social, persiste en alcanzar sus metas, realizar las cosas impecables. Le gusta mantener su área de trabajo de forma organizada.",
            minus: "Auto conflictivo, perezoso, poco manejo con lo social, no es cuidadoso o esmerado, desaliñado, poco controlado, de carácter disparejo, suele no ser respetuoso con otros, explosivo, despreocupado de protocolos, es inestable, no le interesa verse bien cuando está solo, sin metas claras.",
        },
        Q4: {
            label: "Q4 — Tensión",
            plus: "Tenso, enérgico, impaciente, intranquilo, irritable, incapaz de mantenerse inactivo, suele manifestar una energía incansable y mostrarse intranquilo cuando tiene que esperar. Puede bloquear el desempeño con sus miedos situacionales y fobias.",
            minus: "Relajado, plácido, tranquilo, paciente, calmado, satisfecho, no se frustra con rapidez y le resulta fácil ser paciente con la gente. En algunas situaciones su estado de mucha satisfacción puede llevarlo al bajo rendimiento.",
        },
    },

    // ── FEMENINO ──────────────────────────────────────────────────────────
    F: {
        A: {
            label: "A — Cordialidad",
            plus: "Cortés, afectiva en el trato a los demás, cálida, gentil, atenta a los demás, simpática, colaboradora, adaptable, amable, emocionalmente expresiva, de buen genio, se siente confortable en situaciones de cercanía personal.",
            minus: "Fría, impersonal, distante, rígida, centrada en las cosas, crítica, tiene bajo nivel de empatía, es inflexible, desconfiada, cerrada, egoísta y poco afectuosa. Suele ser reservada, le gusta el trabajo en solitario. Óptima para el manejo de computadoras, área contable o programador.",
        },
        B: {
            label: "B — Razonamiento",
            plus: "Inteligente, gran capacidad para entender, pensar y manejar información. Tiende a ser rápida en la comprensión de las ideas, de pensamiento lógico analítico, ágil para reconocer la solución de un problema, creativa y perseverante.",
            minus: "De pensamiento concreto, lentitud para captar y analizar, falta de criterio, se da por vencida fácilmente, deficiencia en su aprendizaje. Puede presentar bajo rendimiento laboral. Suele tener deficiencia en la comprensión e interpretación o falta de atención.",
        },
        C: {
            label: "C — Estabilidad",
            plus: "Gestiona sus emociones de forma positiva, emocionalmente estable, tiende a tomar decisiones asertivas, adaptada, madura, con alto nivel de tolerancia a la frustración, responsable, alto nivel de energía, culmina proyectos y es constante en sus intereses.",
            minus: "Bajo nivel de estabilidad emocional, se frustra fácilmente, negativa, se victimiza, evade responsabilidades, con resentimiento hacia los demás, voluble, neurótica, tiende a darse por vencida, tiene falta de control sobre su vida y altibajos de humor.",
        },
        E: {
            label: "E — Dominancia",
            plus: "Asertiva, competitiva, rebelde, poco convencional, obstinada, de ideas posesivas, fuerte, le gusta que la alaben, adecuada para emergencias o situaciones críticas, segura de sí misma, de mentalidad independiente, le gusta tener el control, tiende a pensar que siempre tienen la razón.",
            minus: "Acomedida, cooperativa, evita los conflictos, manejable, humilde, convencional, conformista, sumisa, insegura, dócil y servicial. En el ámbito laboral prefiere ser supervisada y se le dirija.",
        },
        F: {
            label: "F — Animación",
            plus: "Entusiasta, animosa, espontánea, activa, impulsiva, franca, expresiva. Se le acoge como líder electa, alto nivel de energía.",
            minus: "Seria, reprimida, soberbia, prudente, rígida, introspectiva, precavida, lenta, reflexiva, pesimista, presumida, cautelosa, se apega a sus valores personales, callada, no es dada a la diversión.",
        },
        G: {
            label: "G — Atención a las Normas",
            plus: "Atenta a las normas, cumplida, formal, disciplinada, estable, de carácter exigente, responsable, organizada, dominada por el sentido del deber, perseverante, constante. Seguidora de las reglas, los principios y los buenos modales, necesita de poca supervisión. Antes de tomar una decisión analiza cuidadosamente en lo correcto y justo.",
            minus: "Inconformista, indulgente, despreocupada, acepta pocas obligaciones, suele ser inestable en sus propósitos, libre, voluble, frívola, indulgente consigo misma, falta de atención al compromiso personal y laboral, hace lo que quiere, se guía por sus impulsos, suele no tener normas. Podría sembrar a su alrededor el desorden y el desaliño.",
        },
        H: {
            label: "H — Atrevimiento",
            plus: "Atrevida, sin temor a cosas nuevas, segura en lo social, emprendedora, espontánea, sociable, abierta, dispuesta a intentar nuevas cosas. Cuenta con la capacidad para el manejo de clientes. Soporta situaciones sociales abrumadoras. Extrovertida en ambientes nuevos. Óptima para ser: vendedor, líder, gerente, relaciones públicas.",
            minus: "Tímida, temerosa, cohibida, reprimida, falta de confianza en sí misma, baja autoeficacia, cautelosa, retraída, lenta y torpe para hablar. Le resulta difícil hablar frente a un grupo de gente, puede representar bajo nivel de autoestima. Se intimida fácilmente. Óptima para ser: auxiliar contable, sistemas, supervisor.",
        },
        I: {
            label: "I — Sensibilidad",
            plus: "Sensible, sentimental, demandante de atención y afecto, suele dejarse afectar por sus sentimientos, idealista, soñadora, impaciente, suele ser dependiente, poco práctica e insegura.",
            minus: "Objetiva, nada sentimental, autoritaria, sensibilidad dura, confiada en sí misma, realista, práctica, independiente, responsable, emocionalmente madura, mantiene al grupo trabajando sobre bases realistas acertadas, insensible, actúa basado en evidencias prácticas y lógicas.",
        },
        L: {
            label: "L — Vigilancia",
            plus: "Desconfiada, precavida, vigilante, está pendiente de caerle bien a las personas, rencorosa, generadora de conflictos, actúa con premeditación. Pésima para el grupo, suele dañar el clima. Óptimo para ser vigilante.",
            minus: "Confiada, sin sospechas, adaptable al cambio, no suele presentar tendencia a los celos o envidia, animada, poco competitiva, buena colaboradora de grupo, no rencorosa, cree en la gente, tranquila en las relaciones interpersonales, tiende a ver lo bueno de todo, no suele ser conflictiva.",
        },
        M: {
            label: "M — Abstracción",
            plus: "Abstraída, imaginativa, idealista, centrada en sus necesidades íntimas, poco convencional, despreocupada de lo cotidiano. Sus intereses se dirigen hacia su intimidad, se siente excluida de las actividades de grupo. Ideal para cargos de planeación, asesorías.",
            minus: "Práctica, con los pies en la tierra, realista, cuidadosa, convencional, ansiosa por hacer las cosas correctamente, preocupada por los detalles, capaz de serenidad en las situaciones de emergencia, poco imaginativa, centrada, cuidadosa e interesada. Motivada por resultados inmediatos, evita metas lejanas y confía en juicios prácticos. Óptima para ser secretaria.",
        },
        N: {
            label: "N — Privacidad",
            plus: "Privada, astuta, perspicaz, calculadora, discreta, cuidadosa de no hacer daño, maneja su imagen, piensa lo que dice, respetuosa del otro, ambiciosa, se guarda sus problemas. Con enfoque intelectual y poco sentimental, planeadora de sus actos. Óptima para el área financiera y servicios.",
            minus: "Abierta, genuina, natural, sencilla, sentimental, poco sofisticada, espontánea, poco refinada, torpe, ordinaria, de mente imprecisa, poco juiciosa, poco hábil para analizar motivos y se conforma con lo que encuentra. Hace y dice las cosas sin pensar en sus consecuencias, ingenua, suele ser auténtica.",
        },
        O: {
            label: "O — Aprensión",
            plus: "Insegura, autocrítica y preocupada. Suele ser aprensiva en su forma de laborar, tiende a no dejar pendientes de trabajo.",
            minus: "Segura, despreocupada, alta autoestima y autoeficacia, madura, poco ansiosa, sin temores, entregada a la acción espontánea, alegre, serena, tranquila, soporta la presión. Puede generar bajo rendimiento laboral.",
        },
        Q1: {
            label: "Q1 — Apertura al Cambio",
            plus: "De mente abierta y dispuesta al cambio, tiende a ser liberal, con rechazo a lo tradicional y convencional. Suele avanzar en dirección hacia sus metas y objetivos.",
            minus: "Tradicional, apegada a lo familiar, conservadora, moderada, no imaginativa, conformista, satisfecha de sí y de todo, respetuosa de las ideas establecidas, tolerante de los defectos tradicionales.",
        },
        Q2: {
            label: "Q2 — Autosuficiencia",
            plus: "Individualista, autosuficiente, llena de recursos, prefiere tomar sus propias decisiones y trabajar sola, suele ser independiente. Sigue su propio camino, no necesita el apoyo de otras personas, es introvertida y el grupo no la presiona fácilmente.",
            minus: "Seguidora, buena compañera, se integra en el grupo con facilidad, dependiente, prefiere trabajar y tomar decisiones con los demás, indecisa, depende de la aprobación social, puede ser negativa ya que se deja influenciar.",
        },
        Q3: {
            label: "Q3 — Perfeccionismo",
            plus: "Perfeccionista, organizada, disciplinada, socialmente adaptada, abierta a lo social, persiste en alcanzar sus metas, realizar las cosas impecables. Le gusta mantener su área de trabajo de forma organizada.",
            minus: "Auto conflictivo, perezosa, poco manejo con lo social, no es cuidadosa o esmerada, desaliñada, poco controlada, de carácter disparejo, suele no ser respetuosa con otros, explosiva, despreocupada de protocolos, es inestable, no le interesa verse bien cuando está sola, sin metas claras.",
        },
        Q4: {
            label: "Q4 — Tensión",
            plus: "Tensa, enérgica, impaciente, intranquila, irritable, incapaz de mantenerse inactiva, suele manifestar una energía incansable y mostrarse intranquila cuando tiene que esperar. Puede bloquear el desempeño con sus miedos situacionales y fobias.",
            minus: "Relajada, plácida, tranquila, paciente, calmada, satisfecha, no se frustra con rapidez y le resulta fácil ser paciente con la gente. En algunas situaciones su estado de mucha satisfacción puede llevarlo al bajo rendimiento.",
        },
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE DIBUJO
// ─────────────────────────────────────────────────────────────────────────────

/** Header profesional con logo y título centrado */
const addHeader = (doc, title) => {
    doc.setFillColor(...COLOR_NAVY);
    doc.rect(0, 0, 210, 36, "F");
    try { doc.addImage(Logo, "PNG", 12, 7, 22, 22); } catch (_) { /* logo opcional */ }
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_WHITE);
    doc.text(title, 105, 20, { align: "center" });
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.setTextColor(200, 220, 255);
    doc.text("Conestra — Reporte de Evaluación Psicométrica", 105, 30, { align: "center" });
    doc.setTextColor(...COLOR_BLACK);
};

/** Línea divisoria de sección con etiqueta */
const addSectionTitle = (doc, title, y) => {
    doc.setFillColor(...COLOR_NAVY);
    doc.rect(14, y, 182, 7, "F");
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_WHITE);
    doc.text(title.toUpperCase(), 17, y + 5);
    doc.setTextColor(...COLOR_BLACK);
    return y + 7;
};

/**
 * Bloque de interpretación de un área / factor.
 * Dibuja un rectángulo con fondo azul pálido, título en azul navy y texto justificado.
 * Retorna la nueva posición Y.
 */
const addInterpBlock = (doc, label, desc, texto, y, pageH = 285) => {
    const margin = 14;
    const width = 182;
    const maxW = width - 8;

    // Texto envuelto
    doc.setFontSize(8.5);
    const wrappedDesc = desc ? doc.splitTextToSize(`Definición: ${desc}`, maxW) : [];
    const wrappedTexto = doc.splitTextToSize(texto, maxW);

    const lineH = 5;
    const titleH = 7;
    const padV = 3;
    const blockH = titleH + padV + (wrappedDesc.length * lineH) + (wrappedTexto.length * lineH) + padV + 2;

    // Salto de página si no cabe
    if (y + blockH > pageH) {
        doc.addPage();
        y = 18;
    }

    // Fondo suave
    doc.setFillColor(...COLOR_PALE);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, width, blockH, 2, 2, "FD");

    // Barra izquierda navy
    doc.setFillColor(...COLOR_NAVY);
    doc.rect(margin, y, 3, blockH, "F");

    // Título del bloque
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_NAVY);
    doc.text(label, margin + 6, y + titleH - 1);

    let textY = y + titleH + padV;

    // Descripción en gris
    if (wrappedDesc.length) {
        doc.setFont(undefined, "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_GRAY);
        doc.text(wrappedDesc, margin + 6, textY);
        textY += wrappedDesc.length * lineH + 1;
    }

    // Interpretación
    doc.setFont(undefined, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(wrappedTexto, margin + 6, textY);

    doc.setTextColor(...COLOR_BLACK);
    return y + blockH + 3;
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTABLE: PDF MOSS
// ─────────────────────────────────────────────────────────────────────────────
export const descargarResultadosMossPDF = (usuario, resultados) => {
    const doc = new jsPDF();
    const pageH = doc.internal.pageSize.getHeight() - 10;

    // ── 1. HEADER ──────────────────────────────────────────────────────────
    addHeader(doc, "Resultados Test MOSS");

    // ── 2. INFORMACIÓN DEL USUARIO ─────────────────────────────────────────
    let y = 45;
    y = addSectionTitle(doc, "Información del Candidato", y) + 4;

    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.text(`Nombre:             ${usuario?.nombre || "N/A"}`, 16, y); y += 6;
    doc.text(`Correo:             ${usuario?.correo || "N/A"}`, 16, y); y += 6;
    doc.text(`Total de aciertos:  ${resultados?.totalAciertos ?? "N/A"}`, 16, y); y += 6;

    // Descripción del test
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRAY);
    const mossDescLines = doc.splitTextToSize(MOSS_DESC, 180);
    doc.text(mossDescLines, 16, y);
    y += mossDescLines.length * 4.5 + 4;
    doc.setTextColor(...COLOR_BLACK);

    // ── 3. TABLA DE RESULTADOS ─────────────────────────────────────────────
    y = addSectionTitle(doc, "Resultados por Área", y) + 2;

    const areas = resultados?.areas || {};
    const filas = Object.entries(areas).map(([area, data]) => [
        MOSS_INTERPRETACIONES[area]?.label || area,
        data?.puntaje ?? "N/A",
        data?.percentil != null ? `${data.percentil}%` : "N/A",
        data?.rango ?? "N/A",
    ]);

    autoTable(doc, {
        startY: y,
        head: [["Área", "Puntaje", "Percentil", "Rango / Nivel"]],
        body: filas,
        headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 9, fontStyle: "bold", halign: "center" },
        bodyStyles: { fontSize: 8.5, textColor: COLOR_BLACK, halign: "center" },
        alternateRowStyles: { fillColor: [240, 246, 255] },
        columnStyles: { 0: { halign: "left" } },
        margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 8;

    // ── 4. INTERPRETACIÓN ──────────────────────────────────────────────────
    if (y + 10 > pageH) { doc.addPage(); y = 18; }
    y = addSectionTitle(doc, "Interpretación de Resultados", y) + 5;

    for (const [areaKey, data] of Object.entries(areas)) {
        const config = MOSS_INTERPRETACIONES[areaKey];
        if (!config) continue;

        const rango = data?.rango || "";
        const texto = config.niveles[rango] || `Rango obtenido: ${rango}`;

        y = addInterpBlock(doc, config.label, config.desc, texto, y, pageH);
    }

    // ── FOOTER ─────────────────────────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_GRAY);
        doc.text(`Página ${p} de ${totalPages}  —  Conestra`, 105, 292, { align: "center" });
    }

    doc.save(`Resultados_MOSS_${usuario?.nombre || "usuario"}.pdf`);
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTABLE: PDF 16PF
// ─────────────────────────────────────────────────────────────────────────────
export const descargarResultados16PFPDF = (usuario, resultados) => {
    const doc = new jsPDF();
    const pageH = doc.internal.pageSize.getHeight() - 10;

    // Sexo del usuario para seleccionar la tabla de interpretación correcta
    const sexo = usuario?.sexo === "F" ? "F" : "M";
    const tablaInterp = PF16_INTERPRETACIONES[sexo];

    // ── 1. HEADER ──────────────────────────────────────────────────────────
    addHeader(doc, "Resultados Test 16PF");

    // ── 2. INFORMACIÓN DEL USUARIO ─────────────────────────────────────────
    let y = 45;
    y = addSectionTitle(doc, "Información del Candidato", y) + 4;

    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.text(`Nombre:  ${usuario?.nombre || "N/A"}`, 16, y); y += 6;
    doc.text(`Correo:  ${usuario?.correo || "N/A"}`, 16, y); y += 6;
    doc.text(`Sexo:    ${sexo === "F" ? "Femenino" : "Masculino"}`, 16, y); y += 6;

    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRAY);
    const pf16DescLines = doc.splitTextToSize(PF16_DESC, 180);
    doc.text(pf16DescLines, 16, y);
    y += pf16DescLines.length * 4.5 + 4;
    doc.setTextColor(...COLOR_BLACK);

    // ── 3. TABLA DE RESULTADOS ─────────────────────────────────────────────
    y = addSectionTitle(doc, "Resultados por Factor", y) + 2;

    const decatipos = resultados?.decatipos || {};
    const puntajesBrutos = resultados?.puntajesBrutos || {};
    const factores = Object.keys(decatipos);

    const filas = factores.map((factor) => {
        const dec = decatipos[factor] ?? "N/A";
        const nivel =
            dec >= 8 ? "Alto (+)" :
                dec <= 3 ? "Bajo  (-)" :
                    "Medio";
        return [
            tablaInterp?.[factor]?.label || factor,
            puntajesBrutos[factor] ?? "N/A",
            dec,
            nivel,
        ];
    });

    autoTable(doc, {
        startY: y,
        head: [["Factor", "Puntaje Bruto", "Decatipo", "Nivel"]],
        body: filas,
        headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 9, fontStyle: "bold", halign: "center" },
        bodyStyles: { fontSize: 8, textColor: COLOR_BLACK, halign: "center" },
        alternateRowStyles: { fillColor: [240, 246, 255] },
        columnStyles: { 0: { halign: "left" } },
        margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 8;

    // ── 4. INTERPRETACIÓN — PUNTUACIONES ALTAS (8-10) ─────────────────────
    const factoresAltos = factores.filter((f) => (decatipos[f] ?? 0) >= 8);
    const factoresBajos = factores.filter((f) => (decatipos[f] ?? 10) <= 3);

    if (factoresAltos.length > 0) {
        if (y + 10 > pageH) { doc.addPage(); y = 18; }
        y = addSectionTitle(doc, "Competencias y Rasgos Destacados  (Decatipo 8 – 10)", y) + 5;

        for (const factor of factoresAltos) {
            const config = tablaInterp?.[factor];
            if (!config) continue;
            y = addInterpBlock(
                doc,
                `${config.label}  ·  Decatipo: ${decatipos[factor]}`,
                null,
                config.plus,
                y,
                pageH,
            );
        }
    }

    // ── 5. INTERPRETACIÓN — PUNTUACIONES BAJAS (1-3) ──────────────────────
    if (factoresBajos.length > 0) {
        if (y + 10 > pageH) { doc.addPage(); y = 18; }
        y = addSectionTitle(doc, "Áreas de Oportunidad  (Decatipo 1 – 3)", y) + 5;

        for (const factor of factoresBajos) {
            const config = tablaInterp?.[factor];
            if (!config) continue;
            y = addInterpBlock(
                doc,
                `${config.label}  ·  Decatipo: ${decatipos[factor]}`,
                null,
                config.minus,
                y,
                pageH,
            );
        }
    }

    // Nota si no hay factores extremos
    if (factoresAltos.length === 0 && factoresBajos.length === 0) {
        if (y + 10 > pageH) { doc.addPage(); y = 18; }
        y = addSectionTitle(doc, "Interpretación de Resultados", y) + 6;
        doc.setFontSize(9);
        doc.setTextColor(...COLOR_GRAY);
        doc.text(
            "Todos los factores se encuentran en rango medio (4–7). No se registran tendencias extremas.",
            16, y,
        );
        doc.setTextColor(...COLOR_BLACK);
    }

    // ── FOOTER ─────────────────────────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_GRAY);
        doc.text(`Página ${p} de ${totalPages}  —  Conestra`, 105, 292, { align: "center" });
    }

    doc.save(`Resultados_16PF_${usuario?.nombre || "usuario"}.pdf`);
};