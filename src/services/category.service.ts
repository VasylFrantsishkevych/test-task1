import {urls} from "../config/urls";

export const categoryService = {
    getAllCategories: async () => fetch(urls.categories, {
        headers: {'Accept-Language': 'en'}
    }),

    getTeachersByCategory: async (categoryCode: number, page: number) => fetch(urls.teachers, {
        method: 'POST',
        headers: {
            'Accept-Language': 'en',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "categories": [
                categoryCode
            ],
            "page": page,
            "pageSize": 10
        })
    }),

    sendAveragePrice: async (categoryName: string, averagePrice: number) => fetch(urls.averagePrice, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "categoryName": categoryName,
            "averagePrice": averagePrice
        })
    })
}