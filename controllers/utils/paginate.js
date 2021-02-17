const { cleanUndefined } = require('../../utils')


const serializeRelation = async(filter) => {
    const keys = Object.keys(filter);
    const final = {};
    console.log({filter})
    for(const key of keys ) {
        if(!keys[key]) continue;
        const {populate, Model, filterValue, field} = keys[key];
        if(Model && populate && filterValue, field){
            const result = await Model.find(filterValue,{_id: true});
            if (result && result._id) final[key] = {[field]: result._id};
        }
    }
    return final;
}
/**
 * 
 * @param {*} Model 
 * @param {Object} filter 
 * @param {by: String, direction: String} sort 
 * @param {page: Number, limit: Number} pagination 
 */
exports.paginatedController = async (Model, filter = {}, {by ='id', direction = 'asc'}, {page = 1 , limit = 10}) => {
    const currentPage = parseInt(page);
    const itemPerPage = parseInt(limit);
    let localFilter = await serializeRelation(filter);
    console.log({localFilter});
    
    if(localFilter.search && Model.fieldsSearchFilter) {
        localFilter = {...localFilter, $or: Model.fieldsSearchFilter(filter.search)}
        delete localFilter.search;
    }

    localFilter = cleanUndefined(localFilter);
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = currentPage * itemPerPage;
    const totalItems = await Model.countDocuments(localFilter).exec();
    const maxPage = Math.ceil(totalItems / parseInt(itemPerPage));

    const meta = {};
    if (endIndex < totalItems) meta.next = currentPage + 1;
    if (startIndex > 0) meta.previous = currentPage - 1;
    console.log({localFilter});
    const results = await Model.find(localFilter).limit(itemPerPage).skip(startIndex).sort({ [by]: direction }).exec();
    return {
        results,
        meta: {
            ...meta,
            totalItems,
            maxPage,
            page: currentPage,
            limit: itemPerPage,
        },
    };
};




