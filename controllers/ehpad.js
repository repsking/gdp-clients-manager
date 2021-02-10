const { ApiError } = require("../Errors");
const {controller, ACTION} = require("./utils/controller");
const mysql = require('mysql');
const LINK_FIELD = 'Ehp_reventeLink';

const removeAcent = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const cleanName = str => str.replace(/(\w('|’))/g, '').replace(/[\(\)'’\"]/g, '');

const formtForUrl = str => removeAcent(cleanName(str).replace(/\s/g, '-').replace(/\-\-/g, '-'));

const createLink = (ehpad) => {
    return ehpad[LINK_FIELD] || formtForUrl(`${ehpad.Ehp_nom.trim()}-${ehpad.Ges_nom.trim()}-${ehpad.Ehp_ville.trim()}`)
}
const generateLink = ehpad => ({...ehpad, [LINK_FIELD]: createLink(ehpad)})

module.exports = controller( (re, res) => {
    const db = mysql.createConnection({
        host: process.env.DB_MYSQL_HOST,
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_MYSQL_PWD,
        database: process.env.DB_MYSQL_NAME
    });
    db.connect(function (err) {
        if (err) throw new ApiError('Sql Database unreacheble', 500);
        db.query(`SELECT *, gestionnaire.* FROM ehpad INNER JOIN gestionnaire ON Ehp_gestionnaireId = Ges_id WHERE Ehp_deleted = 0 AND (${LINK_FIELD} = '')`,  function (err, result) {
            if (err) throw new ApiError('Sql Database unreacheble', 500);

            const errors = [];
            const ehpads = result.map(generateLink);
            
            for(const ehpad of ehpads) {
                try {
                   db.query(`UPDATE ehpad SET ${LINK_FIELD} = '${ehpad[LINK_FIELD]} WHERE Ehp_id = ${ehpad.Ehp_id} `)
                } catch (error) {
                    errors.push(error)
                }
            }
            if(errors.length > 0) return res.status(400).json({message:"Some imports didn't saved correctly", errors: errors.map(err => err.message)})
            return ehpads.length + " ehpads fixed";
        });
    })
})