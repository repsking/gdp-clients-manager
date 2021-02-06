const { cleanUndefined } = require('../../utils')

/**
 * 
 * @param {*} Model 
 * @param {Object} filter 
 * @param {by: String, direction: String} sort 
 * @param {page: Number, limit: Number} pagination 
 */
module.exports = async (Model, filter = {}, {by ='id', direction = 'asc'}, {page = 1 , limit = 10}) => {
    const currentPage = parseInt(page);
    const itemPerPage = parseInt(limit);
    let localFilter = {...filter};
    
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