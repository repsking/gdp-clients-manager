exports.cleanUndefined = (obj) => { 
    for(const key of Object.keys(obj)) {
        if(obj[key] === undefined) delete obj[key]
    }
    return obj;
}

exports.hasUndefined = obj => Object.keys(obj).some(key => obj[key] === undefined)