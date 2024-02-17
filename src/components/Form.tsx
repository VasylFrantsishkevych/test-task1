import {FC, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import classes from './Form.module.css'
import {ICategory, ICategoryResponse} from "../interfaces/category.interface";
import {categoryService} from "../services/category.service";
import {ITeacher} from "../interfaces/teacher.interface";

type FormValue = {
    category: string
}

const Form: FC = () => {

    const [
        categoriesResponse,
        setCategoriesResponse] = useState<ICategoryResponse[]>([]);

    const {
        register,
        handleSubmit,
        reset} = useForm<FormValue>();

    const getCategories = async (): Promise<ICategoryResponse[]> => {
        const response = await categoryService.getAllCategories();
        return await response.json();
    }

    const getPrices = async (categoryCode: number, page: number, price: number[] = []): Promise<number[]> => {
        const res = await categoryService.getTeachersByCategory(categoryCode, page)
        const data = await res.json() as ITeacher
        const {pageSize, totalResults, page: currentPage, teachers} = data;
        const totalPage = Math.floor(totalResults / pageSize);
        teachers.forEach(teacher => {
            const {pricePerHour} = teacher;
            price.push(pricePerHour)
        });

        if (currentPage === totalPage) {
            return price;
        }else {
            page++
            return getPrices(categoryCode, page, price)
        }

    }

    const sendAveragePrice = async (categoryName: string, averagePrice: number) => {
        const response = await categoryService.sendAveragePrice(categoryName, averagePrice)
        return await response.text()
    }

    useEffect( () => {
        getCategories().then(data => setCategoriesResponse(data))
    }, [])

    const flattenCategories = (categories: ICategoryResponse[]) => {
        let result: ICategory[] = [];

        const flatten = (category: ICategoryResponse) => {
            const { name, code, childrenCategories } = category;
            result.push({ name, code });

            if (childrenCategories && childrenCategories.length > 0) {
                childrenCategories.forEach(child => flatten(child));
            }
        }

        categories.forEach(category => flatten(category));

        return result;
    }
    const categories = flattenCategories(categoriesResponse)

    const calculateAveragePrice = (prices: number[]) => {
        return prices.reduce((accum, value) => accum + value, 0) / prices.length;
    }

    const onSubmit = (data: FormValue) => {
        const dataFromSelect = Object.values(data)[0].split(',');
        const categoryCode = +dataFromSelect[0];
        const categoryName = dataFromSelect[1];
        let page = 0

        getPrices(categoryCode, page).then(prices => {
            const averagePrice = calculateAveragePrice(prices)
            sendAveragePrice(categoryName, averagePrice).then(data => console.log(data))
        })
        reset();
    }

    return (
        <div className={classes.container}>
            <div className={classes.wrap}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <select {...register('category')}>
                        <option>Select Category</option>
                        {
                            categories.map(({code, name}) =>
                                <option key={code} value={`${code}, ${name}`}>{name}</option>)
                        }
                    </select>
                    <button>
                        Calculate average price
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Form;