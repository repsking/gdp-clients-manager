const ROLES = {
    contributor: {
        label: "Contributor",
        name: "contributor",
        value: 128,
    },
    admin: {
        label: "Administrator",
        name: "admin",
        value: 1024,
    },
    superadmin: {
        label: "Saliou",
        name: "superadmin",
        value: 2048,
    },
    reps: {
        label: "Reps's",
        name: "reps",
        value: 4096,
    },
    reader: {
        label: "reader",
        name: "reader",
        value: 64,
    }
}
exports.ROLES = ROLES

exports.serializeRole = role => {
    const entry = Object.entries(ROLES).find(([_key, { label, value }]) => value === role || label === role);
    if (!entry) console.log(`Something happened with the roleSerializer : Entry is not defined. Originale`, { role });
    return entry && entry[1] && entry[1].label;
}
exports.deserializeRole = role => role;