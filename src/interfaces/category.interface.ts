export interface ICategoryResponse {
    id: string,
    name: string,
    code: number,
    description: string,
    childrenCategories: IChildrenCategory[],
}

export interface ICategory {
    name: string,
    code: number,
}

export interface IChildrenCategory {
    id: string,
    name: string,
    code: number,
    description: string,
    childrenCategories: [],
}