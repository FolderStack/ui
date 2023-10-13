/**
 * Calculate pages to display in pagination.
 * @param currentPage - The current page number.
 * @param maxPage - The maximum page number.
 * @returns An array of numbers representing pages to be displayed.
 */
export function calculatePagination(
    currentPage: number,
    maxPage: number
): number[] {
    let pages: number[] = [];

    // If maxPage <= 5, show all pages
    if (maxPage <= 5) {
        for (let i = 1; i <= maxPage; i++) {
            pages.push(i);
        }
        return pages;
    }

    // If currentPage is near the start
    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
    }

    // If currentPage is near the end
    if (currentPage >= maxPage - 2) {
        return [maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage];
    }

    // Otherwise, show currentPage with two before and two after
    return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
    ];
}
