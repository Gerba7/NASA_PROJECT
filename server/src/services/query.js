// pagination logic to reuse it in any endpoint

const DEFAULT_PAGE_LIMIT = 0; // with 0, mongo returns all the documents in the collection
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {  // param comes as a string
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER; // from the query parameters in the request, if page is not defined 1 will be the dafault value
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; // returns the absolute value of a number (always positive), and if it is a string it converts it to number
    const skip = (page - 1) * limit;

    return {
        skip: skip,
        limit: limit, 
    }     
};

module.exports = {
    getPagination,
};