DEFAULT_PAGE_LIMIT = 0; //ZERO RETURNS ALL DOCUMENT IF PAGE LIMIT IS NOT SET
DEFAULT_PAGE_NUMBER = 1; //RETURNS ONE DOCUMENT IF PAGE NUMBER IS NOT SET

function getPagination(query){
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    }
}

module.export = {
    getPagination
}