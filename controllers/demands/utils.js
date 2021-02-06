exports.serializeUser = ({ email, phone, name, firstname, zipcode }) => ({
    email,
    phone,
    firstname,
    zipcode,
    name,
});

exports.serializeDevice = ({ navigator, screen, lang }) => ({
    navigator,
    screen,
    lang,
});

exports.serializeProgramme = ({ programmeName, programmeId, programmeVille, programmeGestionnaire, thematique,villeProduct, nomProduct, gestionnaireProduct, thematiqueProduct }) => ({
    name: programmeName || nomProduct,
    id: programmeId,
    ville: programmeVille || villeProduct,
    gestionnaire: programmeGestionnaire || gestionnaireProduct,
    thematique: thematique || thematiqueProduct,
});

exports.serializeDemand = (body) => ({
    url: body.url || "origin missing",
    origin: body.origin || "gdpcom",
    action: body.action || "no-action-given",
    message: body.message,
    user: serializeUser(body),
    device: serializeDevice(body),
});

exports.serializeProgrammeDemand = (body) => ({
    ...serializeDemand(body),
    message: body.message || "progamme_info",
    programme: serializeProgramme(body)
});