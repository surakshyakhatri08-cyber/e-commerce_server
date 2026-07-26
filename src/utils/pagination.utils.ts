
export const getPaginationMetaData = (totalCount: number, limit: number, currentPage: number) => {

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
    }
}