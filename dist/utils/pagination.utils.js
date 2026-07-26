"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMetaData = void 0;
const getPaginationMetaData = (totalCount, limit, currentPage) => {
    const totalPage = Math.ceil(totalCount / limit);
    const nextPage = currentPage < totalPage ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    return {
        total_count: totalCount,
        total_page: totalPage,
        next_page: nextPage,
        prev_page: prevPage,
        limit,
        current_page: currentPage,
    };
};
exports.getPaginationMetaData = getPaginationMetaData;
