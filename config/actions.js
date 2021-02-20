const forms = [
    {
        name: "beContacted",
        label: "Demande à être recontacté",
    },
    {
        name: "common",
        label: "Demande Formulaire",
    },
    {
        name: "programInfo",
        label: "Demande info programme",
    }
];

exports.PROSPECT_FORMS  = forms

exports.exist = action => forms.map(form => form.name).includes(action);
exports.getAction = action => forms.find(form => { const rgex = new RegExp(action) ; return rgex.test(form.name,'i') } )