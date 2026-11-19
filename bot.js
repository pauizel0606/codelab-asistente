// =====================================================================
//  Motor de la demo del Asistente IA de Codelab.
//  Los negocios son ficticios. La demo responde con la información de
//  cada negocio (base de conocimiento) y capta contactos; la versión
//  para clientes se conecta a un modelo de IA desde un servidor.
// =====================================================================
window.BOT_PROFILES = {
  dental: {
    name: "Clínica Dental Lumen", initials: "L", color: "#0e8f86",
    tab: { es: "Clínica dental", ca: "Clínica dental" },
    greet: { es: "¡Hola! Soy el asistente de Clínica Dental Lumen. Puedo informarte de horarios, precios y tratamientos, o pedirte cita. ¿En qué te ayudo?", ca: "Hola! Sóc l'assistent de Clínica Dental Lumen. Et puc informar d'horaris, preus i tractaments, o demanar-te cita. En què t'ajudo?" },
    chips: { es: ["¿Cuánto cuesta una limpieza?", "Me duele una muela", "¿Qué horario tenéis?", "Quiero pedir cita"], ca: ["Quant costa una neteja?", "Em fa mal un queixal", "Quin horari teniu?", "Vull demanar cita"] },
    stats: [23, 4, 88],
    intents: [
      { id: "horario", label: { es: "Horario", ca: "Horari" }, kw: ["horario", "horari", "abierto", "obert", "abris", "obriu", "abren", "cerrais", "tanqueu", "sabado", "dissabte", "a que hora", "a quina hora"],
        a: { es: "Abrimos de lunes a viernes de 9:00 a 20:00 y los sábados de 9:00 a 14:00.", ca: "Obrim de dilluns a divendres de 9:00 a 20:00 i els dissabtes de 9:00 a 14:00." } },
      { id: "precios", label: { es: "Precios", ca: "Preus" }, kw: ["precio", "preu", "cuesta", "costa", "cuanto", "quant", "tarifa", "limpieza", "neteja", "blanqueamiento", "blanqueig", "ortodoncia", "implante", "implant", "presupuesto", "pressupost"],
        a: { es: "La primera visita con revisión es gratuita. Una limpieza dental cuesta 45 € y el blanqueamiento, desde 180 €. Para ortodoncia e implantes te hacemos un presupuesto personalizado en la primera visita.", ca: "La primera visita amb revisió és gratuïta. Una neteja dental costa 45 € i el blanqueig, des de 180 €. Per a ortodòncia i implants et fem un pressupost personalitzat a la primera visita." } },
      { id: "urgencia", label: { es: "Urgencia", ca: "Urgència" }, kw: ["urgencia", "urgent", "dolor", "duele", "fa mal", "muela", "queixal", "emergencia", "roto", "trencat", "inflamado", "inflamat"], lead: true,
        a: { es: "Siento que te encuentres mal. Reservamos huecos cada día para urgencias, así que podemos atenderte hoy mismo. Para avisar al equipo, ¿cómo te llamas?", ca: "Sento que no et trobis bé. Reservem forats cada dia per a urgències, així que et podem atendre avui mateix. Per avisar l'equip, com et dius?" } },
      { id: "cita", label: { es: "Pedir cita", ca: "Demanar cita" }, kw: ["cita", "pedir hora", "demanar hora", "reservar", "reserva", "visita", "quiero ir", "vull anar", "primera visita"], lead: true,
        a: { es: "¡Perfecto! Te ayudo a pedir cita. ¿Cómo te llamas?", ca: "Perfecte! T'ajudo a demanar cita. Com et dius?" } },
      { id: "ubicacion", label: { es: "Ubicación", ca: "Ubicació" }, kw: ["donde", "on sou", "on esteu", "direccion", "adreca", "ubicacion", "ubicacio", "llegar", "arribar", "aparcar", "parking", "aparcament", "metro"],
        a: { es: "Estamos en la calle Mayor, 24. Hay un parking público a 50 metros y la parada de metro más cercana está a 3 minutos a pie.", ca: "Som al carrer Major, 24. Hi ha un aparcament públic a 50 metres i la parada de metro més propera és a 3 minuts a peu." } },
      { id: "pago", label: { es: "Pago y financiación", ca: "Pagament i finançament" }, kw: ["pagar", "pago", "pagament", "financiar", "financiacion", "finançament", "plazos", "terminis", "tarjeta", "targeta", "bizum", "seguro", "mutua", "asseguranca"],
        a: { es: "Puedes pagar con tarjeta, efectivo o Bizum. Los tratamientos de más de 300 € se pueden financiar hasta en 12 meses sin intereses, y trabajamos con las principales mutuas.", ca: "Pots pagar amb targeta, efectiu o Bizum. Els tractaments de més de 300 € es poden finançar fins a 12 mesos sense interessos, i treballem amb les principals mútues." } }
    ]
  },

  gym: {
    name: "Gimnàs Impuls", initials: "I", color: "#d4501e",
    tab: { es: "Gimnasio", ca: "Gimnàs" },
    greet: { es: "¡Hola! Soy el asistente de Gimnàs Impuls. Pregúntame por cuotas, clases u horarios, o te consigo un día de prueba gratis.", ca: "Hola! Sóc l'assistent de Gimnàs Impuls. Pregunta'm per quotes, classes o horaris, o et consegueixo un dia de prova gratuït." },
    chips: { es: ["¿Cuánto cuesta la cuota?", "¿Qué clases hay?", "¿Tiene permanencia?", "Quiero probar un día"], ca: ["Quant costa la quota?", "Quines classes hi ha?", "Hi ha permanència?", "Vull provar un dia"] },
    stats: [41, 7, 91],
    intents: [
      { id: "precios", label: { es: "Cuotas", ca: "Quotes" }, kw: ["precio", "preu", "cuota", "quota", "cuesta", "costa", "cuanto", "quant", "matricula", "tarifa", "mensual", "anual"],
        a: { es: "La cuota mensual es de 39 € y, con la anual, te sale a 34 € al mes. Este mes no cobramos matrícula y todas las clases dirigidas están incluidas.", ca: "La quota mensual és de 39 € i, amb l'anual, et surt a 34 € al mes. Aquest mes no cobrem matrícula i totes les classes dirigides hi són incloses." } },
      { id: "clases", label: { es: "Clases", ca: "Classes" }, kw: ["clase", "clases", "classe", "classes", "yoga", "pilates", "spinning", "crossfit", "zumba", "boxeo", "boxa", "actividades", "activitats"],
        a: { es: "Tenemos más de 60 clases semanales: spinning, yoga, pilates, body pump, boxeo y entrenamiento funcional. Se reservan desde la app del gimnasio.", ca: "Tenim més de 60 classes setmanals: spinning, ioga, pilates, body pump, boxa i entrenament funcional. Es reserven des de l'app del gimnàs." } },
      { id: "prueba", label: { es: "Día de prueba", ca: "Dia de prova" }, kw: ["prueba", "probar", "prova", "provar", "gratis", "gratuit", "invitacion", "apuntarme", "apuntar-me", "apuntar", "inscribir", "alta", "hacerme socio", "fer-me soci"], lead: true,
        a: { es: "¡Genial! Te regalamos un día de prueba gratis para que conozcas las instalaciones. ¿Cómo te llamas?", ca: "Genial! Et regalem un dia de prova gratuït perquè coneguis les instal·lacions. Com et dius?" } },
      { id: "horario", label: { es: "Horario", ca: "Horari" }, kw: ["horario", "horari", "abierto", "obert", "abris", "obriu", "cerrais", "tanqueu", "domingo", "diumenge", "fin de semana", "cap de setmana", "a que hora", "a quina hora"],
        a: { es: "Abrimos de lunes a viernes de 6:30 a 23:00 y los fines de semana de 8:00 a 21:00.", ca: "Obrim de dilluns a divendres de 6:30 a 23:00 i els caps de setmana de 8:00 a 21:00." } },
      { id: "baja", label: { es: "Permanencia", ca: "Permanència" }, kw: ["baja", "baixa", "cancelar", "cancel·lar", "permanencia", "permanència", "compromiso", "compromis"],
        a: { es: "No hay permanencia. Puedes darte de baja cuando quieras desde la app o en recepción, avisando antes del día 25 del mes.", ca: "No hi ha permanència. Pots donar-te de baixa quan vulguis des de l'app o a recepció, avisant abans del dia 25 del mes." } },
      { id: "entrenador", label: { es: "Entrenador personal", ca: "Entrenador personal" }, kw: ["entrenador", "personal", "trainer", "nutricion", "nutricio", "dieta", "rutina", "plan"],
        a: { es: "Sí, tenemos entrenadores personales y nutricionista. La primera sesión de valoración es gratuita.", ca: "Sí, tenim entrenadors personals i nutricionista. La primera sessió de valoració és gratuïta." } },
      { id: "ubicacion", label: { es: "Ubicación", ca: "Ubicació" }, kw: ["donde", "on sou", "on esteu", "direccion", "adreca", "ubicacion", "ubicacio", "llegar", "arribar", "aparcar", "parking", "aparcament"],
        a: { es: "Estamos en la avenida del Parque, 8. Los socios tienen 2 horas de parking gratuito.", ca: "Som a l'avinguda del Parc, 8. Els socis tenen 2 hores d'aparcament gratuït." } }
    ]
  },

  realestate: {
    name: "Inmobiliaria Horizonte", initials: "H", color: "#6d4bd8",
    tab: { es: "Inmobiliaria", ca: "Immobiliària" },
    greet: { es: "¡Hola! Soy el asistente de Inmobiliaria Horizonte. ¿Buscas comprar, alquilar o vender una vivienda?", ca: "Hola! Sóc l'assistent d'Inmobiliaria Horizonte. Busques comprar, llogar o vendre un habitatge?" },
    chips: { es: ["Quiero vender mi piso", "Busco piso de alquiler", "¿Me ayudáis con la hipoteca?", "Quiero visitar un piso"], ca: ["Vull vendre el meu pis", "Busco pis de lloguer", "M'ajudeu amb la hipoteca?", "Vull visitar un pis"] },
    stats: [18, 5, 84],
    intents: [
      { id: "vender", label: { es: "Vender vivienda", ca: "Vendre habitatge" }, kw: ["vender", "vendre", "venta", "tasar", "taxar", "tasacion", "valorar", "cuanto vale", "quant val", "valoracion", "valoracio"], lead: true,
        a: { es: "Te hacemos una valoración gratuita de tu vivienda en 48 horas, con datos reales de ventas de la zona. ¿Cómo te llamas?", ca: "Et fem una valoració gratuïta del teu habitatge en 48 hores, amb dades reals de vendes de la zona. Com et dius?" } },
      { id: "alquilar", label: { es: "Alquiler", ca: "Lloguer" }, kw: ["alquilar", "alquiler", "llogar", "lloguer", "renta", "arrendar", "alquilo", "de alquiler", "en alquiler", "de lloguer", "en lloguer"],
        a: { es: "Tenemos pisos de alquiler desde 850 € al mes. Pedimos nómina o contrato de trabajo y una fianza de dos mensualidades.", ca: "Tenim pisos de lloguer des de 850 € al mes. Demanem nòmina o contracte de treball i una fiança de dues mensualitats." } },
      { id: "comprar", label: { es: "Comprar vivienda", ca: "Comprar habitatge" }, kw: ["comprar", "compra", "busco piso", "busco casa", "cerco pis", "vivienda", "habitatge", "obra nueva", "obra nova"], lead: true,
        a: { es: "Tenemos más de 120 viviendas en venta en la zona. Para enviarte una selección que encaje contigo, ¿cómo te llamas?", ca: "Tenim més de 120 habitatges en venda a la zona. Per enviar-te una selecció que encaixi amb tu, com et dius?" } },
      { id: "hipoteca", label: { es: "Hipoteca", ca: "Hipoteca" }, kw: ["hipoteca", "hipoteques", "banco", "banc", "prestamo", "prestec", "financiacion", "finançament"],
        a: { es: "Nuestro asesor financiero compara las ofertas de varios bancos sin coste para ti y te acompaña en todo el proceso.", ca: "El nostre assessor financer compara les ofertes de diversos bancs sense cost per a tu i t'acompanya en tot el procés." } },
      { id: "visita", label: { es: "Visita", ca: "Visita" }, kw: ["visita", "visitar", "ver el piso", "veure el pis", "ensenar", "ensenyar", "verlo", "veure'l"], lead: true,
        a: { es: "¡Claro! Organizamos la visita cuando mejor te vaya, también por la tarde. ¿Cómo te llamas?", ca: "És clar! Organitzem la visita quan millor et vagi, també a la tarda. Com et dius?" } },
      { id: "horario", label: { es: "Horario", ca: "Horari" }, kw: ["horario", "horari", "abierto", "obert", "abris", "obriu", "a que hora", "a quina hora", "oficina"],
        a: { es: "Atendemos de lunes a viernes de 9:30 a 14:00 y de 16:30 a 20:00, y los sábados por la mañana con cita previa. La oficina está en la plaza de la Iglesia, 3.", ca: "Atenem de dilluns a divendres de 9:30 a 14:00 i de 16:30 a 20:00, i els dissabtes al matí amb cita prèvia. L'oficina és a la plaça de l'Església, 3." } }
    ]
  }
};

window.BOT_COMMON = {
  intents: [
    { id: "humano", label: { es: "Hablar con una persona", ca: "Parlar amb una persona" }, kw: ["persona", "humano", "huma", "hablar con alguien", "parlar amb algu", "llamadme", "truqueu-me", "telefono", "telefon", "llamar", "trucar"], lead: true,
      a: { es: "Claro. Déjame tus datos y alguien del equipo te llamará hoy. ¿Cómo te llamas?", ca: "És clar. Deixa'm les teves dades i algú de l'equip et trucarà avui. Com et dius?" } },
    { id: "saludo", label: { es: "Saludo", ca: "Salutació" }, kw: ["hola", "buenas", "buenos dias", "bon dia", "bona tarda", "bones", "hey", "ei"], short: true,
      a: { es: "¡Hola! ¿En qué puedo ayudarte?", ca: "Hola! En què et puc ajudar?" } },
    { id: "gracias", label: { es: "Agradecimiento", ca: "Agraïment" }, kw: ["gracias", "gracies", "merci", "moltes gracies", "muchas gracias", "perfecto", "perfecte", "genial"], short: true,
      a: { es: "¡A ti! Si necesitas algo más, aquí estoy.", ca: "A tu! Si necessites res més, aquí em tens." } }
  ],
  ui: {
    es: {
      fallback: "No tengo esa información, pero puedo pedir que alguien del equipo te conteste. Si quieres, dime tu nombre y te llamamos.",
      askPhone: "Encantado, {name}. ¿A qué teléfono podemos llamarte?",
      badPhone: "Perdona, no lo he entendido. ¿Me escribes un número de teléfono de 9 cifras?",
      done: "¡Listo, {name}! He pasado tu solicitud al equipo de {biz} y te llamarán al {phone} lo antes posible.",
      badName: "¿Me dices tu nombre, por favor?"
    },
    ca: {
      fallback: "No tinc aquesta informació, però puc demanar que algú de l'equip et respongui. Si vols, digues-me el teu nom i et truquem.",
      askPhone: "Encantat, {name}. A quin telèfon et podem trucar?",
      badPhone: "Perdona, no ho he entès. M'escrius un número de telèfon de 9 xifres?",
      done: "Fet, {name}! He passat la teva sol·licitud a l'equip de {biz} i et trucaran al {phone} tan aviat com puguin.",
      badName: "Em dius el teu nom, si us plau?"
    }
  }
};

// ---------------------------------------------------------------------
//  Motor: busca la intención que mejor encaja y gestiona la captación.
// ---------------------------------------------------------------------
window.createBot = function (profileId, lang) {
  var P = window.BOT_PROFILES[profileId], C = window.BOT_COMMON;
  var state = { step: null, intent: null, name: "", fallbacks: 0 };

  function norm(s) {
    return " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/·/g, "").replace(/[^a-z0-9ñç' -]/g, " ").replace(/\s+/g, " ").trim() + " ";
  }
  function match(text) {
    var t = norm(text), best = null, bestScore = 0;
    P.intents.concat(C.intents).forEach(function (it) {
      var score = 0;
      it.kw.forEach(function (k) {
        var nk = norm(k).trim();
        if (t.indexOf(" " + nk) !== -1) score += nk.indexOf(" ") > 0 ? 2 : 1;
      });
      if (it.short && score) score = 0.5; // saludos y gracias solo si no hay nada mejor
      if (score > bestScore) { bestScore = score; best = it; }
    });
    return best;
  }
  function fill(s, v) { return s.replace(/\{(\w+)\}/g, function (_, k) { return v[k] || ""; }); }

  return {
    profile: P,
    greet: function () { return P.greet[lang]; },
    chips: function () { return P.chips[lang]; },
    // Devuelve { text, intent, lead }
    reply: function (text) {
      var ui = C.ui[lang];
      // Si mientras pedimos datos el cliente hace otra pregunta, la respondemos
      if (state.step) {
        var other = match(text);
        if (other && !other.short && (/\?/.test(text) || text.trim().split(/\s+/).length > 3)) state.step = null;
        else if (other && other.short && state.step === "name") return { text: ui.badName };
      }
      if (state.step === "name") {
        var name = text.trim().replace(/^(me llamo|soy|em dic|sóc|soc|mi nombre es|el meu nom és)\s+/i, "").split(/[,.!]/)[0].trim();
        name = name.split(" ").slice(0, 3).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (!name || /\d/.test(name) || name.length > 40) return { text: ui.badName };
        state.name = name; state.step = "phone";
        return { text: fill(ui.askPhone, { name: name }) };
      }
      if (state.step === "phone") {
        var digits = text.replace(/[^\d+]/g, "");
        if (digits.replace(/\D/g, "").length < 9) return { text: ui.badPhone };
        var lead = { name: state.name, phone: digits, reason: state.intent ? state.intent.label[lang] : "" };
        state.step = null;
        return { text: fill(ui.done, { name: state.name, biz: P.name, phone: digits }), lead: lead, intent: state.intent };
      }
      var it = match(text);
      if (!it) {
        state.fallbacks++;
        state.intent = { id: "otro", label: { es: "Consulta sin respuesta", ca: "Consulta sense resposta" } };
        state.step = "name";
        return { text: ui.fallback, intent: state.intent, unresolved: true };
      }
      state.intent = it;
      if (it.lead) state.step = "name";
      return { text: it.a[lang], intent: it };
    }
  };
};
