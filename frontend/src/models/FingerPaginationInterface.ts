export interface FingerPaginationInterface {
    page: number;
    page_size: number;
    sort_field: string;
    sort_direction: "asc" | "desc";
    search: string;
}